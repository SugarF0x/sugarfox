/**
 * MongoDB schema
 *
 * @category server
 * @namespace schema
 *
 * @author {@link https://github.com/SugarF0x Sugar_F0x}
 */

/**
 * User Database schema
 *
 * @memberOf schema
 * @name User
 * @type {Mongoose}
 */
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
  state: {
    type: String,
    default: 'active'
  },
  options: {
    privacy: {
      profile: {
        type: String,
        default: 'public'
      },
      activity: {
        type: String,
        default: 'public'
      },
      friends: {
        type: String,
        default: 'public'
      },
      inbox: {
        type: String,
        default: 'public'
      },
    }
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

  // Prevent crash on hot reload as a result of duplicate schema creation
let toExport;
try {
  toExport = mongoose.model('User');
} catch (err) {
  toExport = mongoose.model('User', userSchema);
}

module.exports = toExport;
