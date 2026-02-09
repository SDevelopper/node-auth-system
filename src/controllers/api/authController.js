const authService = require('../../services/authService');

const setAccessCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'lax',   
    maxAge: 15 * 60 * 1000
  });
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax', 
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh'
  });
};


async function performLogin(req, res, serviceMethod) {
    const { email, password } = req.body;
    const result = await serviceMethod(email, password);

    setAccessCookie(res, result.accessToken);
    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      user: {
        id: result.user.customer_id,
        role: result.user.role,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        phone: result.telephone || ""
      }
    })
}

async function handleUserLogin(req, res) {
  return performLogin(req, res, authService.userLogin);
}

async function handleAdminLogin(req, res) {
  return performLogin(req, res, authService.adminLogin);
}

async function handleRegistration(req, res) {

  const result = await authService.register(req.body);

  return res.status(201).json(result); 
}


async function handleLogout(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
  } catch{}

  res.clearCookie('refreshToken', { path: '/api/auth/refresh' }); 
  res.clearCookie('token'); 
  
  return res.json({ success: true, message: "Вышли из системы" });
}

module.exports = { 
  handleUserLogin, 
  handleAdminLogin,
  handleRegistration, 
  handleLogout 
};
