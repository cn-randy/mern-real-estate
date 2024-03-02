/**
 * custom exception class inherits from Error class
 * Adds status code property
 * Optionally adds stack trace if app is not in production mode
 */
class CustomErrorException extends Error {
  constructor(message, statusCode, errors) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;

    if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default CustomErrorException;
