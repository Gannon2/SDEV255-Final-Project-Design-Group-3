const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "Please include your first name."],
    maxlength: [24, "Name is too long (24 max)"],
  },
  lname: {
    type: String,
    required: [true, "Please include your first name."],
    maxlength: [24, "Name is too long (24 max)"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  accountType: {
    type: Number,
    min: [0, "Out of range"],
    max: [2, "Out of range"],
  },
  courses: [
    {
      type: Schema.Types.ObjectID,
      ref: "Course",
    },
  ],
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("unregistered email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
