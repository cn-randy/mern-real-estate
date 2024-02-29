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
  if (err.name === "CastError") {
    console.log("Invalid mongoDB id: ", err);
    const message = `Resource not found. Invalid ${err.path}`;
    error = new CustomErrorException(message, StatusCodes.NOT_FOUND, err.path);
    return res
      .status(error.statusCode)
      .json({ message: error.message, field: error.path });
  }

  // mongo validation errors
  if (err.name === "ValidationError") {
    console.log("Invalid mongoDB validation error: ", err);
    const mongooseError = Object.values(err.errors).map((value) => ({
      message: value.message,
      path: value.path,
    }));
    error = new CustomErrorException(
      mongooseError.message,
      StatusCodes.BAD_REQUEST,
      mongooseError.path,
    );
    return res
      .status(error.statusCode)
      .json({ message: error.message, field: error.path });
  }

  // mongo Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    const path = Object.keys(err.keyPattern)[0];
    error = new CustomErrorException(message, StatusCodes.BAD_REQUEST, path);
    console.log("Duplicate error: ", message, path);
    return res.status(error.statusCode).json({ message, path });
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
      .json({ message: error.message, field: error.path });
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

  // All other development mode errors
  if (process.env.MONGO_ENVIRONMENT !== "cloud") {
    console.log("All other development errors: ", err);
    return res.status(error.statusCode).json({
      message: error.message,
      error: err,
      field: "unknown",
      stack: err.stack,
    });
  }

  // all other production mode errors
  if (process.env.MONGO_ENVIRONMENT === "cloud") {
    console.log("All other production mode errors: ", err);
    return res.status(error.statusCode).json({
      message: error.message,
      error: err,
      field: "unknown",
    });
  }
}
