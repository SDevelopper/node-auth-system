const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const AppError = require('../errors/AppError');
const { SERVICES, CODES } = require('../constants/errors');

/**
 * @param {string} requiredRole
 */

function checkAuth(requiredRole) {

  return async function authMiddleware(req, res, next) {

    function verify (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (requiredRole && decoded.role !== requiredRole) {
        throw new AppError(SERVICES.AUTH, CODES.FORBIDDEN);
      }
      return decoded;
    };

    try {
      let token = req.cookies?.accessToken;
      
      if(!token && req.headers.authorization?.startsWith('Bearer '))
        token = req.headers.authorization.substring(7);

      if (token) {
        req.user = verify(token);
        return next();
      }

      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) throw new AppError(SERVICES.AUTH, CODES.UNAUTHORIZED);

      const result = await authService.refreshAccessToken(refreshToken);
      
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      req.user = verify(result.accessToken);
      next();
    
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = checkAuth;
