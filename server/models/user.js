const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  permission: {
    type: String,
    default: 'default'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    required: true
  },
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
  }
});

module.exports = mongoose.model("User", userSchema);