const Room = require('../models/Room');
const Message = require('../models/Message');

// Create room
exports.createRoom = async (req, res) => {
  try {
    const { name, description, roomType, members } = req.body;

    const room = new Room({
      name,
      description,
      roomType,
      createdBy: members[0],
members: members
    });

    await room.save();
    await room.populate('members', 'username avatar');

    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create room', error: error.message });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('members', 'username avatar')
      .populate('createdBy', 'username');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch room', error: error.message });
  }
};

// Add member to room
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('members', 'username avatar');

    res.json({
      message: 'Member added successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add member', error: error.message });
  }
};

// Remove member from room
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: userId } },
      { new: true }
    ).populate('members', 'username avatar');

    res.json({
      message: 'Member removed successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove member', error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Delete all messages in room
    await Message.deleteMany({ roomId: req.params.id });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete room', error: error.message });
  }
};
