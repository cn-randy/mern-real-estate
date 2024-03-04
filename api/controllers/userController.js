import { StatusCodes } from "http-status-codes";
import CustomErrorException from "../exceptions/CustomErrorException.js";
import User from "../models/user.js";

/**
 * ? Test
 *
 * @method GET
 * @URL api/v1/users/test
 *
 * @param req  -http request object
 * @param res  - http response object
 * @param next - invokes next middleware in middleware chain
 *
 * @returns {Promise<void>}
 */
export const test = function (req, res, next) {
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "API route is working" });
};

/**
 * ? update user
 *
 * @method POST
 * @URL api/v1/users/:id
 *
 * @param req  -http request object
 * @param res  - http response object
 *
 * @returns {Promise<void>}
 */
export const updateUser = async function (req, res, next) {
  let { username, email, avatar, password } = req.body;

  if (req.user.id !== req.params.id) {
    throw new CustomErrorException(
      "You can only update your own account",
      StatusCodes.UNAUTHORIZED,
      {
        field: "system",
        message: "You can only update your own account",
      },
    );
  }

  if (password) {
    password = bcrypt.hashSync(req.body.password, 10);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username,
        email,
        avatar,
        password,
      },
    },
    { new: true },
  );
  console.log("updateUser: ", user);

  user.password = undefined;
  res.status(StatusCodes.OK).json({ success: true, user });
};
