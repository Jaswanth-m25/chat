const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// const { clearChat } = require('../controllers/messageController');
// const authenticateToken = require('../middleware/auth');

// Get private messages with a user
router.get('/private/:currentUserId/:userId', messageController.getPrivateMessages);

// Get room messages
router.get('/room/:roomId', messageController.getRoomMessages);

// Get chat history
router.get('/history', messageController.getChatHistory);

// Mark message as read
router.put('/read/:messageId', messageController.markAsRead);

// Upload a file/image
router.delete(
  '/clear/:currentUserId/:userId',
  messageController.clearChat
);
router.delete('/message/:messageId', messageController.deleteMessage);
router.put(
  '/edit/:messageId',
  messageController.editMessage
);
module.exports = router;
