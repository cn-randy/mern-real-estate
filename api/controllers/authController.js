import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import CustomErrorException from "../exceptions/CustomErrorException.js";
import { TIME } from "../config/constants.js";

/**
 * returns a json web token
 *
 * A valid token is created using the jwt.sign method
 *?   @docs https://www.npmjs.com/package/jsonwebtoken
 *?   jwt.sign(payload, secretOrPrivateKey, [options, callback])
 *
 *        payload:            - object containing the data to be stored in the token
 *        secretOrPrivateKey  - random string
 *        options             - configuration options
 * @param id the token payload
 *
 * @returns {*}
 */
const getToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE_DAYS}d`,
  });
};

/**
 * ? Register a new user
 *
 * * 1. Create and save a new user
 *
 * @method POST
 * @URL api/v1/auth/signup
 *
 * @param req  - http request object The body object xontains the user properties
 *?              { username, email, password }
 *               other user properties are set/updated by other functions
 *
 * @param res  - http response object
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
 * ? Sign in user
 *
 * @method POST
 * @URL api/v1/auth/signin
 *
 * @param req  -http request object
 * @param res  - http response object
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

  // do not send back password
  validUser.password = undefined;
  const token = getToken(validUser._id);

  res
    .status(StatusCodes.OK)
    .cookie("access_token", token, {
      httpOnly: true,
      expiresIn: Date.now() + TIME.TO_DAY * Number(process.env.JWT_EXPIRE_DAYS),
    })
    .json({ success: true, user: validUser });
};

/**
 * ? Sign in with google
 *
 * @method POST
 * @URL api/v1/auth/google
 *
 * * There are two scenerios that we need to handle here
 *
 * * 1. The google user does not yet exist in our database
 * *    We need to save the user in the database. Our model requires a password
 * *    but google does not supply one therefore we need to create one. Remember
 * *    a password must contain at least one number, one lower case leter, one
 * *    uppercase leter, one special character and be getween 8 and 15 characters
 * *    in lehgth.
 *
 * * 2. The google user already exists in our database
 * *    Create a new user and save it to the database
 *
 * * In both cases we need to log the user in by creating a http only cookie
 * * Finally the uaer object is returned to the client.
 *
 * @param req  -http request object
 * @param res  - http response object
 *
 * @returns {Promise<void>}
 */
export const google = async function (req, res) {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    //*       .status(StatusCodes.OK)
    const token = getToken(user._id);

    return res
      .status(StatusCodes.OK)
      .cookie("access_token", token, {
        httpOnly: true,
        expiresIn:
          Date.now() + TIME.TO_DAY * Number(process.env.JWT_EXPIRE_DAYS),
      })
      .json({ success: true, user });
  }

  //* register as new user and sign in
  //* generate 16 character password
  const generatedPassword =
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-8) +
    "H!";

  const newUser = new User({
    username:
      req.body.name.split(" ").join("").toLowerCase() +
      Math.random().toString(36).slice(-4),
    email: req.body.email,
    password: generatedPassword,
    avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.GHGGLYe7gDfZUzF_tElxiQHaHa%26pid%3DApi%26h%3D160&f=1&ipt=09c0293c9832c8015d39d01a16ab323145180a791179fda2e6afffe519f176e6&ipo=images",
  });

  await newUser.save();

  //* sign in user
  // do not send password back to client
  newUser.password = undefined;

  const token = getToken(newUser._id);

  res
    .status(StatusCodes.OK)
    .cookie("access_token", token, {
      httpOnly: true,
      expiresIn: Date.now() + TIME.TO_DAY * Number(process.env.JWT_EXPIRE_DAYS),
    })
    .json({ success: true, user: newUser });
};
