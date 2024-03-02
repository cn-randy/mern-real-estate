import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import CustomErrorException from "../exceptions/CustomErrorException.js";

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
  res.status(StatusCodes.OK).json({
    success: true,
    message: "User created.",
  });
};

/**
 * ? Sign up new user
 *
 * @method POST
 * @URL api/v1/auth/signin
 *
 * @param req  -http request object
 * @param res  - http response object
 * @param next - invokes next middleware in middleware chain
 *
 * @returns {Promise<void>}
 */
export const signin = async function (req, res) {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email }).select("+password");
  if (!validUser) {
    throw new CustomErrorException(
      "Sign in credentials error",
      StatusCodes.NOT_FOUND,
      {
        success: false,
        system: { message: "Invalid credentials" },
      },
    );
  }

  // verify password
  const isAuthenticated = validUser.comparePassword(password);
  if (!isAuthenticated) {
    throw new CustomErrorException(
      "Sign in credentials error",
      StatusCodes.CONFLICT,
      {
        success: false,
        system: { message: "Invalid credentials" },
      },
    );
  }

  // authenticate user
  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE_DAYS}d`,
  });

  // do not send back password
  validUser.password = undefined;

  res
    .cookie("access_token", token, {
      httpOnly: true,
      expiresIn:
        Date.now() + 1000 * 60 * 60 * 24 * Number(process.env.JWT_EXPIRE_DAYS),
    })
    .status(StatusCodes.OK)
    .json({ success: true, user: validUser });
};
