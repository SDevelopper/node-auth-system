const { CODES } = require('../constants/errors');

module.exports = {
  [CODES.NOT_FOUND]: { status: 404, field: 'email', message: "*Пользователь не найден" },
  [CODES.WRONG_PASSWORD]: { status: 401, field: 'password', message: "*Неверный пароль" },
  [CODES.FORBIDDEN]: { status: 403, field: null, message: "*Доступ запрещен" },
  [CODES.USER_EXISTS]: { status: 409, field: 'email', message: "*Email уже занят" },
  [CODES.USER_EXISTS_PHONE]: { status: 409, field: 'telephone', message: "*Телефон уже занят" },
  [CODES.NO_TOKEN]: { status: 401, field: null, message: "*Токен не предоставлен" },
  [CODES.TOKEN_REVOKED]: { status: 401, field: null, message: "*Токен недействителен или отозван" },
  [CODES.INVALID_TOKEN]: { status: 401, field: null, message: "*Неверный токен" },
};
