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
  publicId: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    immutable: true
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
    required: true,
    default: 'Not Assigned'
  },
  password: {
    type: String,
    required: true,
    default: 'Not Assigned'
  },
  avatar: {
    type: String,
    default: '/img/avatar-default.webp'
  }
});

module.exports = mongoose.model("User", userSchema);