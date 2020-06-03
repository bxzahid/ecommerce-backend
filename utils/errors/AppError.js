module.exports = class AppError extends Error {
  constructor(message, status, error) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.error = error;
  }
};
