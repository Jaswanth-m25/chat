const Message = require('../models/Message');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');
// Get messages between two users
exports.getPrivateMessages = async (req, res) => {

  try {

    const { userId, currentUserId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: currentUserId,
          receiverId: userId
        },
        {
          senderId: userId,
          receiverId: currentUserId
        }
      ]
    })
    .populate('senderId', 'username avatar')
    .populate('receiverId', 'username avatar')
    .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Get room messages
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .populate('senderId', 'username avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// Get chat history with pagination
exports.getChatHistory = async (req, res) => {

  try {

    const {
      userId,
      currentUserId,
      roomId,
      limit = 50,
      skip = 0
    } = req.query;

    let query = {};

    if (userId && currentUserId) {

      query = {
        $or: [
          {
            senderId: currentUserId,
            receiverId: userId
          },
          {
            senderId: userId,
            receiverId: currentUserId
          }
        ]
      };

    } else if (roomId) {

      query = { roomId };
    }

    const messages = await Message.find(query)
      .populate('senderId', 'username avatar')
      .populate('receiverId', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json(messages.reverse());

  } catch (error) {

    res.status(500).json({
      message: 'Failed to fetch chat history',
      error: error.message
    });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Message marked as read', message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message as read', error: error.message });
  }
};
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const isImage = file.mimetype.startsWith('image/');

    return {
      folder: isImage ? 'chat-images' : 'chat-files',
      resource_type: 'auto'
    };
  }
});

exports.upload = multer({ storage: storage });

exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.path;
    const mimetype = req.file.mimetype;
    const isImage = mimetype.startsWith('image/');
    
    res.json({
      url: fileUrl,
      messageType: isImage ? 'image' : 'file',
      originalName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file', error: error.message });
  }
};

exports.clearChat = async (req, res) => {
  try {

    const currentUserId = new mongoose.Types.ObjectId(
      req.params.currentUserId
    );

    const otherUserId = new mongoose.Types.ObjectId(
      req.params.userId
    );

    const result = await Message.deleteMany({
      $or: [
        {
          senderId: currentUserId,
          receiverId: otherUserId
        },
        {
          senderId: otherUserId,
          receiverId: currentUserId
        }
      ]
    });

    console.log("Deleted:", result);

    res.json({
      message: 'Chat cleared successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to clear chat',
      error: error.message
    });

  }
};
exports.deleteMessage = async (req, res) => {
  try {

    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      message: 'Message deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Failed to delete message',
      error: error.message
    });

  }
};
exports.editMessage = async (req, res) => {

  try {

    const { content } = req.body;

    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      {
        content,
        edited: true,
        editedAt: new Date()
      },
      { new: true }
    );

    res.json(message);

  } catch (error) {

    res.status(500).json({
      message: 'Failed to edit message'
    });

  }

};