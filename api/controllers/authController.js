import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";

/**
 * ? Sign up new user
 *
 * @method POST
 * @URL api/v1/auth/signup
 *
 * @param req  -http request object
 * @param res  - http response object
 * @param next - invokes next middleware in middleware chain
 *
 * @returns {Promise<void>}
 */
export const signup = async function (req, res) {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(StatusCodes.OK).json({ message: "User created" });
};
