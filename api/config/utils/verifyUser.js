import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const verifyUser = function (req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    throw new CustomErrorException("Unauthorized", StatusCodes.UNAUTHORIZED, {
      field: "system",
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new CustomErrorException("Forbidden", StatusCodes.FORBIDDEN, {
        field: "system",
        message: "Forbidden",
      });
    }

    req.user = user;
    next();
  });
};
