const jwt = require('jsonwebtoken');

const handleUnauthorized = (req, res, message) => {
  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.status(401).json({ error: message });
  }
  return res.redirect('/login');
};

/**
 * @param {string} requiredRole
 */

const checkAuth = (requiredRole) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.token;
    if (!token) {
      console.log('Доступ запрещен: Токен отсутствует');
      return handleUnauthorized(req, res, "Вы не авторизованы");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: "У вас недостаточно прав" });
      }

      console.log(`Успешный вход: ID ${decoded.id}, Роль: ${decoded.role}`);
      next();
      
    } catch (err) {
      console.error('Ошибка верификации токена:', err.message);
      return handleUnauthorized(req, res, "Сессия истекла, войдите снова");
    }
  };
};

module.exports = checkAuth;