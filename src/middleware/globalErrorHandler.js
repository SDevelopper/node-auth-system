const ERROR_MAP = require('../errors');
const AppError = require('../errors/AppError');

const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const config = ERROR_MAP[err.service]?.[err.code];
    if (config) {
      return res.status(config.status).json({
        error: config.field ? { [config.field]: config.message } : { generic: config.message }
      });
    }
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
    errors: err.flatten().fieldErrors
  });
}

  console.error('!!! CRITICAL ERROR:', err);
  res.status(500).json({ error: { generic: 'Критическая ошибка сервера' } });
};

module.exports = globalErrorHandler;
