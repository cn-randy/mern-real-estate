import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongoose.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
// catch all async errors. No need to wrap async function calls
// there is no need to do anything else.
// just throws a regular error
import "express-async-errors";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

//* handle exceptions not caught by the app
process.on("uncaughtException", (err) => {
  console.error(`Shutting down due to an uncaught exception: ${err}`);
  process.exit(1);
});

const app = express();

//* request parsers
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

//* routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

//* catch errors that were caught by the app
app.use(errorMiddleware);

//* connect to database and spin up server
try {
  await connectDB();

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server is listening on port ${port}`));
} catch (err) {
  console.error(
    `Server shutting down. Could not connect to database due to error: ${err}`,
  );
  process.exit(1);
}
