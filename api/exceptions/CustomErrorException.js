/**
 * custom exception class inherits from Error class
 * Adds status code property
 * Optionally adds stack trace if app is not in production mode
 */
class CustomErrorException extends Error {
  constructor(message, statusCode, field = "unknown") {
    super(message);

    this.statusCode = statusCode;
    this.field = field;

    if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default CustomErrorException;
