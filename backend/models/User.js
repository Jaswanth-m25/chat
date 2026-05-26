const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      // required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away'],
      default: 'offline'
    },
    isTyping: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
