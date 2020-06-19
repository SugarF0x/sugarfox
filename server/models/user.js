const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    default: 'default'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);