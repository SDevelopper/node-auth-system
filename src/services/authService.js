const AppError = require('../errors/AppError');
const { SERVICES, CODES } = require('../constants/errors');
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (inputPassword, savedHash) => {
  return await bcrypt.compare(inputPassword, savedHash);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.customer_id, 
      role: user.role,
      t: 'a' 
    }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.customer_id, t: 'r' }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '14d' }
  );
};

const verifyUserCredentials = async (email, password) => {
  const user = await userRepository.findForAuth(email);
  if (!user) throw new AppError(SERVICES.AUTH, CODES.NOT_FOUND);

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) throw new AppError(SERVICES.AUTH, CODES.WRONG_PASSWORD);

  return user;
};

const createSession = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await userRepository.saveToken(user.customer_id, refreshToken);
  return { accessToken, refreshToken, user };
};

const userLogin = async(email, password) =>{
   const user = await verifyUserCredentials(email, password);
   if (user.role !== 'user') {
    throw new AppError(SERVICES.AUTH, CODES.FORBIDDEN);
  }
  return await createSession(user);
}

const adminLogin = async(email, password)=>{
  const user = await verifyUserCredentials(email, password);

  if (user.role !== 'admin') {
    throw new AppError(SERVICES.AUTH, CODES.FORBIDDEN);
  }
  return await createSession(user);
}

const refreshAccessToken = async (token) => {
  if (!token) throw new AppError(SERVICES.AUTH, CODES.NO_TOKEN);

  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await userRepository.findById(payload.id);

  if (!user || user.token !== token) {
    throw new AppError(SERVICES.AUTH, CODES.TOKEN_REVOKED);
  }

  const accessToken = generateAccessToken(user);
  return { accessToken, role: user.role };
};


const register = async ({ firstname, lastname, telephone, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser)  throw new AppError(SERVICES.AUTH, CODES.USER_EXISTS);

  const existingPhone = await userRepository.findByTelephone(telephone);
  if (existingPhone)  throw new AppError(SERVICES.AUTH, CODES.USER_EXISTS_PHONE);

  const hashedPassword = await hashPassword(password);
  await userRepository.create({
    firstname,
    lastname,
    telephone,
    email,
    password: hashedPassword
  });

  return { 
    success: true, 
    message: 'Регистрация прошла успешно. Пожалуйста, войдите в систему.' 
  };
};


const logout = async (token) => {
  if (!token) return; 
  
  try {
    const payload = jwt.decode(token); 
    if (payload?.id) {
      await userRepository.saveToken(payload.id, null);
    }
  } catch (e) {
    console.error("DB error logout:", e.message);
  }
  return { success: true };
};

module.exports = {
  adminLogin,
  userLogin,
  refreshAccessToken,
  register,
  hashPassword,
  verifyPassword,
  logout
};
