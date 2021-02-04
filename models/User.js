const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  resetPasswordToken: String
});

module.exports = mongoose.model("users", User);
