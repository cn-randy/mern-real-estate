import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new monggose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username."],
      unique,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address."],
      email: ["Please enter a valid email address."],
      unique,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Please enter your password."],
      validate: {
        validator: function (value) {
          const regex =
            /(?=^.{8,15})(?=.*\d)(?=.*[!@#$%^&*?/<>\[\]{}?():.])(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

          return regex.test(value);
        },
        message:
          "Passwords must contain at least 1 upper case letter, 1 lowercase letter, 1 number and 1 special character (!@#$%^&*?()+-,.:?/<>{}[]). and be between 8 and 15 characters in length",
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
