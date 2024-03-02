import { StatusCodes } from "http-status-codes";
import CustomErrorException from "../exceptions/CustomErrorException.js";

export default function (err, req, res, next) {
  let error = {
    statusCode: err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err?.message || "Something went wrong",
    field: err?.field || "unknown",
  };

  //* mongoDB errors
  //* handle invalid mongoDB id error

  const errors = {};

  if (err.name === "CastError") {
    console.log("Invalid mongoDB id: ", err);
    const message = `Resource not found. Invalid ${err.path}`;
    error = new CustomErrorException(message, StatusCodes.NOT_FOUND, err.path);
    return res.status(error.statusCode).json({ success: err });
    // return res
    //   .status(error.statusCode)
    //   .json({ success: false message: error.message, field: error.path });
  }

  /**
   * mongoose validation errors
   * mongoose returns a mongoose validation error object which fully describes
   * all validation errors returned by the mongoose api. We are interested in
   * the errors property which is an object where each property is an object
   * that holds the error data for each field where there is an array.
   * error data for a particular field,
   * example
   *     "errors": {
   *         "password": {
   *             "name": "ValidatorError",
   *             "message": "Please enter your password.",
   *             "properties": {
   *                 "message": "Please enter your password.",
   *                 "type": "required",
   *                 "path": "password"
   *             },
   *             "kind": "required",
   *             "path": "password"
   *         },
   *         "email": {
   *             "name": "ValidatorError",
   *             "message": "Please enter your email address.",
   *             "properties": {
   *                 "message": "Please enter your email address.",
   *                 "type": "required",
   *                 "path": "email"
   *             },
   *             "kind": "required",
   *             "path": "email"
   *         },
   *         "username": {
   *             "name": "ValidatorError",
   *             "message": "Please enter your username.",
   *             "properties": {
   *                 "message": "Please enter your username.",
   *                 "type": "required",
   *                 "path": "username"
   *             },
   *             "kind": "required",
   *             "path": "username"
   *         }
   *     }
   */
  if (err.name === "ValidationError") {
    Object.entries(err.errors).forEach((error) => {
      errors[error[0]] = { message: error[1].message };
    });

    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors });
  }

  /**
   *   mongo Duplicate key error
   *   Mongoose return a duplicate key error object when a unique constraint failes
   *   Unique constraints are checked after all other validation rules and only
   *   filres if all of those validations have passed.
   *
   *   Mongoose returns an error with the following properties
   *   example:
   *         {
   *            err: {
   *              "errors": {
   *              "index": 0,
   *              "code": 11000,
   *              "keyPattern": {
   *                 "username": 1
   *              },
   *              "keyValue": {
   *                "username": "Fred"
   *              }
   *           }
   *         }
   */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errors[field] = {
      message: `${field} is already in use`,
    };

    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors });
  }

  // Json web token errors
  // handle wrong jwt
  if (err.name === "JsonWebTokenError") {
    console.log("Invalid JWT token error: ", err);
    const message = "Json web taken is invalid. Please try again.";
    error = new CustomErrorException(
      message,
      StatusCodes.BAD_REQUEST,
      jsonWebToken,
    );
    return res
      .status(error.statusCode)
      .json({ success: false, message: error.message, field: error.path });
  }

  // handle expired jwt error
  if (err.name === "TokenExpiredError") {
    console.log("Invalid JWT expired error: ", err);
    const message = "Json web taken has expired. Please try again.";
    error = new CustomErrorException(
      message,
      StatusCodes.BAD_REQUEST,
      "jsonWebToken",
    );
    return res
      .status(error.statusCode)
      .json({ message: error.message, field: error.path });
  }

  // All other errors
  console.log("All other errors: ", err);
  return res.status(error.statusCode).json({
    success: false,
    errors: err.errors,
    stack: process.env.MONGO_ENVIRONMENT !== "cloud" && err.stack,
  });
}
