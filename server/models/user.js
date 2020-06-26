const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  permission: {
    type: String,
    default: 'default'
  },
  created_date: {
    type: Date,
    default: Date.now(),
    immutable: true
  },
  publicID: {
    type: String,
    default: Date.now()
  },
  method: {
    type: String,
    required: true,
    immutable: true
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
  },
  avatar: {
    type: String,
    default: '/img/avatar-default.webp'
  }
});

module.exports = mongoose.model("User", userSchema);