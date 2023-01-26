const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Hero = require("./hero");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 30,
    trim: true,
    validate(value) {
      if (
        !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/.test(
          value
        )
      ) {
        throw new Error(
          "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character (!,@,#,$,%,^,&,*)"
        );
      }
    },
  },
  myHeroes: [
    {
      hero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hero",
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save({ validateBeforeSave: false });

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login (email not found)");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login (password is incorrect)");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
