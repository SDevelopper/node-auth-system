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

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    setAccessCookie(res, result.accessToken);
    setRefreshCookie(res, result.refreshToken);

    return res.json({
      success: true,
      user: { 
        id: result.user.customer_id, 
        name: result.user.name, 
        role: result.user.role 
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    if (err.message === 'NOT_FOUND') {
      return res.status(401).json({ error: { email: "*Пользователь не найден" } });
    }
    if (err.message === 'WRONG_PASSWORD') {
      return res.status(401).json({ error: { password: "*Неверный пароль" } });
    }
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}

async function handleRegistration(req, res) {
  try {
    const { name, lastname, telephone, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ error: "Заполните все обязательные поля" });
    }

    const result = await authService.register({ name, lastname, telephone, email, password });

    return res.status(201).json(result); 

  } catch (err) {
    if (err.message === 'USER_EXISTS') {
      return res.status(409).json({ error: { email: "*Этот email уже занят" } });
    }
    if (err.message === 'USER_EXISTS_PHONE') {
      return res.status(409).json({ error: { telephone: "*Этот номер уже зарегистрирован" } });
    }
    return res.status(500).json({ error: "Ошибка при регистрации" });
  }
}

async function handleRefresh(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: "Нет refresh-token" });

    const result = await authService.refreshToken(refreshToken);

    setAccessCookie(res, result.accessToken);

    return res.json({
      success: true,
    });

  } catch (err) {
    res.clearCookie('token');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    return res.status(401).json({ error: "Сессия истекла" });
  }
}

async function handleLogout(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' }); 
    res.clearCookie('token'); 
    
    return res.json({ success: true, message: "Вышли из системы" });
  } catch (err) {
    return res.status(500).json({ error: "Ошибка при выходе" });
  }
}

module.exports = { 
  handleLogin, 
  handleRefresh, 
  handleRegistration, 
  handleLogout 
};