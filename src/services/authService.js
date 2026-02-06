const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (inputPassword, savedHash) => {
  return await bcrypt.compare(inputPassword, savedHash);
};


const login = async (email, password) => {
  const user = await userRepository.findForAuth(email);
  if (!user) throw new Error('NOT_FOUND');

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) throw new Error('WRONG_PASSWORD');

  const role = user.role || 'user';
  const accessToken = jwt.sign(
    { 
      id: user.customer_id, 
      role: role,
      t: 'a'
    }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.customer_id, t: 'r' },   
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '14d' }
  );

  await userRepository.saveToken(user.customer_id, refreshToken);
  return { 
  accessToken, 
  refreshToken, 
  user: {
    id: user.customer_id,
    name: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: role
  }};
};

const refreshToken = async (token) => {
  if (!token) throw new Error('NO_TOKEN');

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userRepository.findById(payload.id); 

    if (!user || user.token !== token) {
       throw new Error('TOKEN_REVOKED'); 
    }
    const accessToken = jwt.sign(
      { 
        id: user.customer_id, 
        role: user.role,
        t: 'a' 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  } catch (err) {
    throw new Error('INVALID_TOKEN');
  }
};


const register = async ({ name, lastname, telephone, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new Error('USER_EXISTS');

  const existingPhone = await userRepository.findByTelephone(telephone);
  if (existingPhone) throw new Error('USER_EXISTS_PHONE');

  const hashedPassword = await hashPassword(password);
  await userRepository.create({
    name,
    lastname,
    telephone,
    email,
    password: hashedPassword
  });

  return { 
    success: true, 
    message: 'Регистрация прошла успешно.' 
  };
};


const logout = async (token) => {
  if (!token) return; 

  try {
    const payload = jwt.decode(token); 
    if (payload && payload.id) {
      await userRepository.saveToken(payload.id, null);
    }
  } catch (e) {}
  return { success: true };
};

module.exports = {
  login,
  refreshToken,
  register,
  hashPassword,
  verifyPassword,
  logout
};
