const Message = require('../models/Message');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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

    console.log("PARAMS:", req.params);

    const currentUserId = req.params.currentUserId;
    const otherUserId = req.params.userId;

    console.log("CURRENT:", currentUserId);
    console.log("OTHER:", otherUserId);

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

    console.log("DELETE RESULT:", result);

    res.json({
      message: "Chat cleared successfully"
    });

  } catch (error) {

    console.error("CLEAR CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to clear chat",
      error: error.message
    });

  }
};