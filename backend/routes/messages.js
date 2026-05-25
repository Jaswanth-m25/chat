const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/auth');

// Get private messages with a user
router.get('/private/:userId', authenticateToken, messageController.getPrivateMessages);

// Get room messages
router.get('/room/:roomId', authenticateToken, messageController.getRoomMessages);

// Get chat history
router.get('/history', authenticateToken, messageController.getChatHistory);

// Mark message as read
router.put('/read/:messageId', authenticateToken, messageController.markAsRead);

// Upload a file/image
router.post('/upload', authenticateToken, messageController.upload.single('file'), messageController.uploadFile);

module.exports = router;
