# Real-Time Chat Application

A full-featured real-time chat application built with MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## Features

✨ **User Authentication**
- User registration with email validation
- Secure login with JWT tokens
- Protected routes

🔐 **Security**
- JWT-based authentication
- Password hashing with bcryptjs
- Protected API endpoints

💬 **Messaging Features**
- Global chat room
- Private one-to-one messaging
- Group chat rooms
- Message history with pagination
- Message timestamps and read receipts

⚡ **Real-Time Features**
- Real-time messaging using Socket.IO
- Online/offline user status
- Typing indicators for all chat types
- Online users list
- User presence tracking

🎨 **User Interface**
- Responsive design (mobile, tablet, desktop)
- Chat sidebar with recent chats
- User list with online status
- Modern gradient-based UI
- Smooth animations and transitions

📱 **Responsive Design**
- Mobile-friendly interface
- Tablet optimized layout
- Desktop version with full features

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB for data persistence
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router for navigation
- Socket.IO Client for real-time updates
- Axios for HTTP requests
- React Icons for UI icons

## Project Structure

```
chat/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── messageController.js
│   │   └── roomController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validators.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Room.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messages.js
│   │   └── rooms.js
│   ├── sockets/
│   │   └── socketHandler.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Auth.js
    │   │   ├── Auth.css
    │   │   ├── Chat.js
    │   │   └── Chat.css
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── SocketContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── .env
    ├── .gitignore
    ├── package.json
    └── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd chat/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat_app
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd chat/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the React development server:
```bash
npm start
```

Frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (except current)
- `GET /api/users/online` - Get online users
- `GET /api/users/search?query=term` - Search users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/recent-chats` - Get recent chats
- `PUT /api/users/profile/:id` - Update user profile

### Messages
- `GET /api/messages/private/:userId` - Get private messages
- `GET /api/messages/room/:roomId` - Get room messages
- `GET /api/messages/history` - Get chat history with pagination
- `PUT /api/messages/read/:messageId` - Mark message as read

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms` - Get all user rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms/:id/add-member` - Add member to room
- `DELETE /api/rooms/:id/remove-member` - Remove member from room
- `DELETE /api/rooms/:id` - Delete room

## Socket Events

### Global Chat
- `globalMessage` - Send message to global chat
- `newGlobalMessage` - Receive new global message
- `globalTyping` - Notify others typing in global chat
- `globalStopTyping` - Notify stop typing
- `usersTyping` - Receive list of typing users

### Private Chat
- `privateMessage` - Send private message
- `newPrivateMessage` - Receive private message
- `joinPrivateChat` - Join private chat room
- `privateTyping` - Notify typing in private chat
- `privateStopTyping` - Notify stop typing
- `privateUserTyping` - Receive typing notification

### Room Chat
- `roomMessage` - Send room message
- `newRoomMessage` - Receive room message
- `joinRoom` - Join room
- `leaveRoom` - Leave room
- `roomTyping` - Notify typing in room
- `roomStopTyping` - Notify stop typing
- `roomUsersTyping` - Receive typing users list

### Connection
- `onlineUsers` - Receive list of online user IDs
- `messageNotification` - Receive message notification
- `messageReadReceipt` - Message read confirmation
- `disconnect` - Handle disconnection

## Features Breakdown

### 1. User Registration & Authentication
- Users can create new accounts with username, email, and password
- Passwords are hashed using bcryptjs
- JWT tokens are issued upon successful registration/login
- Tokens are stored in localStorage for persistence

### 2. User Login/Logout
- Email and password-based authentication
- Secure token validation on protected routes
- Logout clears tokens from client and storage

### 3. Protected Routes
- Frontend routes protected with token validation
- API endpoints protected with JWT middleware
- Automatic redirect to login for unauthenticated users

### 4. Real-Time Messaging
- Socket.IO enables instant message delivery
- Messages persist in MongoDB
- Automatic scrolling to latest messages
- Message content includes sender info and timestamp

### 5. Chat Types
- **Global Chat**: Messages visible to all connected users
- **Private Chat**: One-to-one messages between users
- **Group Chat**: Messages in dedicated chat rooms

### 6. Typing Indicators
- Shows who is typing in real-time
- Works for all chat types (global, private, rooms)
- Automatically clears after inactivity

### 7. User Presence
- Online/offline status tracking
- Real-time updates to online users list
- Status indicator in UI for each user

### 8. Message Persistence
- All messages stored in MongoDB
- Chat history retrieval with pagination
- Message timestamps for chronological ordering

### 9. Chat Sidebar
- Recent chats sorted by latest activity
- Quick access to previous conversations
- User online status indicators
- Unread message count

### 10. Responsive UI
- Mobile-first design approach
- Adapts to different screen sizes
- Touch-friendly interface elements
- Collapsible sidebar on mobile

## Usage

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Browse Users** - Click "Add Chat" to see all available users
4. **Start Chatting**:
   - Click on a user to open private chat
   - Type your message and press Enter or click Send
   - See typing indicators when others are typing
5. **Join Global Chat** - Click "Global Chat" in sidebar
6. **Create Rooms** - Use the API to create group chat rooms
7. **Logout** - Click logout button to end session

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
npm run build
```

### Environment Variables

**Backend (.env)**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - Token expiration time
- `CORS_ORIGIN` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

**Frontend (.env)**
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SOCKET_URL` - WebSocket server URL

## Future Enhancements

- [ ] Message search functionality
- [ ] File and image sharing
- [ ] User profile pages
- [ ] Notification system
- [ ] Dark mode theme
- [ ] Message reactions/emojis
- [ ] Voice and video calls
- [ ] User blocking feature
- [ ] Message editing and deletion
- [ ] Admin panel for room management
- [ ] Analytics and statistics
- [ ] Two-factor authentication

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### Socket.IO Connection Failed
- Check CORS_ORIGIN in backend .env
- Verify backend is running on correct port
- Check browser console for detailed error

### Messages Not Appearing
- Verify Socket.IO connection is established
- Check browser console for errors
- Ensure JWT token is valid

### Authentication Issues
- Clear localStorage and login again
- Check JWT_SECRET matches between sessions
- Verify token hasn't expired

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

## Acknowledgments

- Socket.IO for real-time communication
- MongoDB for robust data storage
- React community for excellent documentation
- All contributors and users

---

**Happy Chatting! 🎉**
