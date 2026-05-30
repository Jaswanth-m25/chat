const Message = require('../models/Message');
const User = require('../models/User');
const Room = require('../models/Room');

// Store active users: { userId: socketId }
const activeUsers = {};

// Store typing users: { roomId_or_userId: [{ userId, username, socketId }] }
const typingUsers = {};

const socketHandler = (io) => {
io.use(async (socket, next) => {

  try {

    socket.clerkId = socket.handshake.auth.userId;
    socket.username = socket.handshake.auth.username;

    const mongoUser = await User.findOne({
      clerkId: socket.clerkId
    });

    if (!mongoUser) {
      return next(new Error("MongoDB user not found"));
    }

    socket.userId = mongoUser._id.toString();

    next();

  } catch (error) {

    next(new Error("Socket authentication failed"));
  }
});

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.username} (${socket.userId})`);

    // Store active user
    activeUsers[socket.userId] = socket.id;

    // Update user status to online
    await User.findByIdAndUpdate(socket.userId, { status: 'online' });

    // Emit online users list
    io.emit('onlineUsers', Object.keys(activeUsers));

    // Join global chat room
    socket.join('global-chat');

    // =================== GLOBAL CHAT EVENTS ===================

    socket.on('globalMessage', async (data) => {
      try {
        const message = new Message({
          senderId: socket.userId,
          content: data.content,
          messageType: data.messageType || 'text'
        });
        await message.save();
        await message.populate('senderId', 'username avatar');

        io.to('global-chat').emit('newGlobalMessage', {
          _id: message._id,
          senderId: message.senderId,
          content: message.content,
          messageType: message.messageType,
          createdAt: message.createdAt
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('globalTyping', (data) => {
      const typingKey = 'global-chat';
      if (!typingUsers[typingKey]) {
        typingUsers[typingKey] = [];
      }

      const userTyping = typingUsers[typingKey].find(u => u.userId === socket.userId);
      if (!userTyping) {
        typingUsers[typingKey].push({
          userId: socket.userId,
          username: socket.username,
          socketId: socket.id
        });
      }

      io.to('global-chat').emit('usersTyping', typingUsers[typingKey]);
    });

    socket.on('globalStopTyping', () => {
      const typingKey = 'global-chat';
      if (typingUsers[typingKey]) {
        typingUsers[typingKey] = typingUsers[typingKey].filter(u => u.userId !== socket.userId);
        io.to('global-chat').emit('usersTyping', typingUsers[typingKey]);
      }
    });

    // =================== PRIVATE CHAT EVENTS ===================

socket.on('privateMessage', async (data) => {
  try {

    const { receiverId, content } = data;

const receiver = await User.findById(receiverId);

if (
  receiver?.blockedUsers?.some(
    id => id.toString() === socket.userId
  )
) {

  socket.emit('error', {
    message: 'Message could not be delivered'
  });

  return;
}

    const message = new Message({
      senderId: socket.userId,
      receiverId,
      content,
      messageType: data.messageType || 'text'
    });

    await message.save();
        await message.populate('senderId', 'username avatar');
        await message.populate('receiverId', 'username avatar');

        // Create room for private chat
        const roomId = [socket.userId, receiverId].sort().join('-');
        socket.join(roomId);

        // Send to both users
        io.to(roomId).emit('newPrivateMessage', {
          _id: message._id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          messageType: message.messageType,
          createdAt: message.createdAt,
          isRead: message.isRead
        });

        // Notify receiver if online
        if (activeUsers[receiverId]) {
          io.to(activeUsers[receiverId]).emit('messageNotification', {
            from: socket.username,
            message: content.substring(0, 50),
            senderId: socket.userId
          });
        }
      } catch (error) {
        console.error(error);

socket.emit('error', {
  message: 'Failed to send message',
  error
});
      }
    });

    socket.on('joinPrivateChat', (data) => {
      const { userId } = data;
      const roomId = [socket.userId, userId].sort().join('-');
      socket.join(roomId);
      console.log(`User ${socket.username} joined private chat with ${userId}`);
    });

    socket.on('privateTyping', (data) => {
      const { receiverId } = data;
      const roomId = [socket.userId, receiverId].sort().join('-');
      const typingKey = `private-${roomId}`;

      if (!typingUsers[typingKey]) {
        typingUsers[typingKey] = [];
      }

      const userTyping = typingUsers[typingKey].find(u => u.userId === socket.userId);
      if (!userTyping) {
        typingUsers[typingKey].push({
          userId: socket.userId,
          username: socket.username,
          socketId: socket.id
        });
      }

      socket.to(roomId).emit('privateUserTyping', {
        userId: socket.userId,
        username: socket.username,
        typingUsers: typingUsers[typingKey]
      });
    });

    socket.on('privateStopTyping', (data) => {
      const { receiverId } = data;
      const roomId = [socket.userId, receiverId].sort().join('-');
      const typingKey = `private-${roomId}`;

      if (typingUsers[typingKey]) {
        typingUsers[typingKey] = typingUsers[typingKey].filter(u => u.userId !== socket.userId);
        socket.to(roomId).emit('privateUserTyping', {
          userId: socket.userId,
          typingUsers: typingUsers[typingKey]
        });
      }
    });

    // =================== GROUP CHAT EVENTS ===================

    socket.on('joinRoom', (data) => {
      const { roomId } = data;
      socket.join(`room-${roomId}`);
      socket.to(`room-${roomId}`).emit('userJoinedRoom', {
        username: socket.username,
        userId: socket.userId
      });
      console.log(`User ${socket.username} joined room ${roomId}`);
    });

    socket.on('leaveRoom', (data) => {
      const { roomId } = data;
      socket.leave(`room-${roomId}`);
      io.to(`room-${roomId}`).emit('userLeftRoom', {
        username: socket.username,
        userId: socket.userId
      });
      console.log(`User ${socket.username} left room ${roomId}`);
    });

    socket.on('roomMessage', async (data) => {
      try {
        const { roomId, content } = data;

        const message = new Message({
          senderId: socket.userId,
          roomId,
          content,
          messageType: data.messageType || 'text'
        });
        await message.save();
        await message.populate('senderId', 'username avatar');

        io.to(`room-${roomId}`).emit('newRoomMessage', {
          _id: message._id,
          senderId: message.senderId,
          roomId,
          content: message.content,
          messageType: message.messageType,
          createdAt: message.createdAt
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('roomTyping', (data) => {
      const { roomId } = data;
      const typingKey = `room-${roomId}`;

      if (!typingUsers[typingKey]) {
        typingUsers[typingKey] = [];
      }

      const userTyping = typingUsers[typingKey].find(u => u.userId === socket.userId);
      if (!userTyping) {
        typingUsers[typingKey].push({
          userId: socket.userId,
          username: socket.username,
          socketId: socket.id
        });
      }

      socket.to(`room-${roomId}`).emit('roomUsersTyping', typingUsers[typingKey]);
    });

    socket.on('roomStopTyping', (data) => {
      const { roomId } = data;
      const typingKey = `room-${roomId}`;

      if (typingUsers[typingKey]) {
        typingUsers[typingKey] = typingUsers[typingKey].filter(u => u.userId !== socket.userId);
        socket.to(`room-${roomId}`).emit('roomUsersTyping', typingUsers[typingKey]);
      }
    });

    // =================== MESSAGE READ RECEIPT ===================

    socket.on('markMessageRead', async (data) => {
      try {
        const { messageId } = data;
        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
          readAt: new Date()
        });

        io.emit('messageReadReceipt', { messageId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });

    // =================== DISCONNECT ===================

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.username}`);

      // Remove from active users
      delete activeUsers[socket.userId];

      // Update user status to offline
      await User.findByIdAndUpdate(socket.userId, { status: 'offline' });

      // Emit updated online users list
      io.emit('onlineUsers', Object.keys(activeUsers));

      // Clean up typing indicators
      for (const key in typingUsers) {
        typingUsers[key] = typingUsers[key].filter(u => u.socketId !== socket.id);
        if (typingUsers[key].length === 0) {
          delete typingUsers[key];
        }
      }

      // Notify others that user is offline
      io.emit('userOffline', {
        userId: socket.userId,
        username: socket.username
      });
    });
  });
};

module.exports = socketHandler;
