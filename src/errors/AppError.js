class AppError extends Error {
  constructor(service, code, message = null) {
    super(message || code); 
    this.service = service; 
    this.code = code;
    this.isOperational = true;
  }
}

module.exports = AppError;
