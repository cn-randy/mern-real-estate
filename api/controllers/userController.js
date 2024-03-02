import { StatusCodes } from "http-status-codes";

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
