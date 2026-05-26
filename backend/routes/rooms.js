const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
// const authenticateToken = require('../middleware/auth');

// Create room
router.post('/', roomController.createRoom);

// Get all rooms
router.get('/', roomController.getAllRooms);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Add member to room
router.post('/:id/add-member', roomController.addMember);

// Remove member from room
router.delete('/:id/remove-member', roomController.removeMember);

// Delete room
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
