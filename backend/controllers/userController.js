const User = require('../models/User');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get all users (except current user)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
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
      req.user.id,
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
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid file type. Only images are allowed.' });
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Delete old avatar if exists
    const currentUser = await User.findById(req.user.id);
    if (currentUser.avatar) {
      const oldFilePath = path.join(__dirname, '..', currentUser.avatar);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update user with new avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: fileUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile picture uploaded successfully',
      user
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const recentMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$senderId', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      }
    ]);

    res.json(recentMessages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent chats', error: error.message });
  }
};
