const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const AppError = require('../errors/AppError');
const { SERVICES, CODES } = require('../errors/errorCodes');

/**
 * @param {string} requiredRole
 */
function checkAuth(requiredRole) {
  return async function authMiddleware(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      let token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.accessToken;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;

        if (requiredRole && decoded.role !== requiredRole) {
          return next(new AppError(SERVICES.AUTH, CODES.FORBIDDEN));
        }

        return next();
      }

      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return next(new AppError(SERVICES.AUTH, CODES.NO_TOKEN));
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.cookie('token', result.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      const decoded = jwt.verify(result.accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return next(new AppError(SERVICES.AUTH, CODES.FORBIDDEN));
      }


      next();

    } catch (err) {
      return next(err);
    }
  };
}

module.exports = checkAuth;
