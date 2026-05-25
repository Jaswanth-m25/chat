const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authenticateToken = require('../middleware/auth');

// Create room
router.post('/', authenticateToken, roomController.createRoom);

// Get all rooms
router.get('/', authenticateToken, roomController.getAllRooms);

// Get room by ID
router.get('/:id', authenticateToken, roomController.getRoomById);

// Add member to room
router.post('/:id/add-member', authenticateToken, roomController.addMember);

// Remove member from room
router.delete('/:id/remove-member', authenticateToken, roomController.removeMember);

// Delete room
router.delete('/:id', authenticateToken, roomController.deleteRoom);

module.exports = router;
