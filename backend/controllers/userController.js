const User = require('../models/User');
const Message = require('../models/Message');
const mongoose = require('mongoose');

// Get all users (except current user)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updateData = {};
    
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(req.file.mimetype)) {
  return res.status(400).json({
    message: 'Invalid file type. Only images are allowed.'
  });
}

    // Validate file size (max 5MB)
if (req.file.size > 5 * 1024 * 1024) {
  return res.status(400).json({
    message: 'File size too large. Maximum 5MB allowed.'
  });
}
   const fileUrl = req.file.path;

    // Update user with new avatar
const user = await User.findByIdAndUpdate(
  req.params.id,
      { avatar: fileUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile picture uploaded successfully',
      user
    });
  } catch (error) {

    res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
  }
};


// Get online users
exports.getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find({ status: 'online' }).select('-password');
    res.json(onlineUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch online users', error: error.message });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

// Get recent chats
exports.getRecentChats = async (req, res) => {

  try {

    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('senderId', 'username avatar')
      .populate('receiverId', 'username avatar');

    const uniqueUsers = new Map();

    recentMessages.forEach((msg) => {

      const sender = msg.senderId;
      const receiver = msg.receiverId;

      if (sender?._id) {
        uniqueUsers.set(sender._id.toString(), {
          _id: sender._id,
          userDetails: [sender],
          lastMessage: msg.content
        });
      }

      if (receiver?._id) {
        uniqueUsers.set(receiver._id.toString(), {
          _id: receiver._id,
          userDetails: [receiver],
          lastMessage: msg.content
        });
      }

    });

    res.json(Array.from(uniqueUsers.values()));

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch recent chats'
    });
  }
};
