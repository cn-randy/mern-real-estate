import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please enter your username."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email address."],
      validate: {
        validator: function (email) {
          var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email);
        },
        message: "Please enter a valid email address.",
      },
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
    avatar: {
      type: String,
      default:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.GHGGLYe7gDfZUzF_tElxiQHaHa%26pid%3DApi%26h%3D160&f=1&ipt=09c0293c9832c8015d39d01a16ab323145180a791179fda2e6afffe519f176e6&ipo=images",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  console.log("User: ", this.password);
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compareSync(plainText, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_DAYS },
  );
};

userSchema.methods.sendToken = function (statusCode, res) {
  const token = this.getJwtToken();
  const options = {
    expires: new Date(
      Date.now() +
        1000 * 60 * 60 * 24 * Number(process.env.JWT_EXPIRE_DAYS.slice(0, -1)),
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({ token });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpiry = Date.now() + PASSWORD.RESET_EXPIRY_TIME;

  return resetToken;
};

export default mongoose.model("User", userSchema);
