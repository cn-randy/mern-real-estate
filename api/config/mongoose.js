import mongoose from "mongoose";

/**
 ** Connect to mongoDB
 ** Connect to mongoDB Atlas if in production mode
 ** otherwise connect to local mongoDB service.
 *
 * @returns {Promise<void>}
 */
export const connectDB = async function () {
  const uri =
    process.env.MONGO_ENVIRONMENT === "cloud"
      ? process.env.MONGO_URI
      : process.env.MONGO_LOCAL_URI;

  const con = await mongoose.connect(uri);
  console.log(`MongoDB connected with host: ${con?.connection?.host}`);
};
