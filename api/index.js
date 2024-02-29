import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose.js";

dotenv.config();

const app = express();

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
