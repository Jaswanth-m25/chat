# Real-Time Chat Application

A full-featured real-time chat application built with MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## Features

### ✨ User Authentication & Authorization
- **User Registration**: Email validation with unique username/email constraints
- **Secure Login**: JWT token-based authentication with expiration
- **Session Management**: Automatic session persistence and refresh token support
- **Protected Routes**: Role-based access control on frontend and backend
- **Password Security**: bcryptjs hashing with salt rounds

### 🔐 Security Features
- **JWT Authentication**: Secure token-based API access
- **Password Hashing**: Industry-standard bcryptjs encryption (10 salt rounds)
- **CORS Protection**: Configured CORS for frontend-backend communication
- **Input Validation**: Request body validation on all endpoints
- **Protected Endpoints**: Authorization middleware on sensitive operations
- **Error Handling**: Secure error messages without exposing sensitive info

### 💬 Messaging Capabilities
- **Private Messaging**: One-to-one direct messages between users
- **Group Chat Rooms**: Create and manage group conversations
- **Global Chat Room**: Server-wide public chat channel
- **Message History**: Persistent storage with pagination support
- **Timestamps**: Automatic message timestamps for chronological ordering
- **Read Receipts**: Track which users have read messages
- **Message Persistence**: MongoDB storage for message history

### ⚡ Real-Time Features (Socket.IO)
- **Live Messaging**: Instant message delivery without page refresh
- **Typing Indicators**: See when others are typing in real-time
- **User Presence**: Online/offline status with automatic detection
- **User Activity Tracking**: User join/leave notifications
- **Online User List**: Real-time list of active users
- **Automatic Reconnection**: Handles connection loss gracefully
- **Room-based Events**: Targeted messaging to specific chat rooms

### 🎨 User Interface & Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Chat Sidebar**: Quick access to recent conversations
- **User Directory**: Browse and search all available users
- **Online Status Indicators**: Visual status badges for user availability
- **Modern UI**: Gradient-based design with smooth animations
- **Transition Effects**: Smooth page and message transitions
- **Dark/Light Theme Ready**: CSS structure supports theme switching

### 📱 Cross-Platform Responsiveness
- **Mobile Optimization**: Touch-friendly interface and small screen layouts
- **Tablet Layout**: Optimized two-pane layout for tablets
- **Desktop Experience**: Full-featured interface with additional features
- **Flexible Grid System**: Responsive grid for different screen sizes

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
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   ├── roomController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validators.js
│   ├── models/
│   │   ├── Message.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clerk.js
│   │   ├── messages.js
│   │   ├── rooms.js
│   │   └── users.js
│   ├── sockets/
│   │   └── socketHandler.js
│   ├── utils/
│   │   └── passwordHelper.js
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AboutPage.jsx
    │   │   ├── Auth.jsx
    │   │   ├── Chat.jsx
    │   │   ├── ForgetPassword.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── Login.jsx
    │   │   ├── LoginSignup.jsx
    │   │   ├── Profile.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── About.css
    │   │   ├── Auth.css
    │   │   ├── Chat.css
    │   │   ├── ForgetPassword.css
    │   │   ├── HomePage.css
    │   │   └── LoginSignup.css
    │   ├── context/
    │   │   └── SocketContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── lib/
    │   ├── assets/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   ├── index.css
    │   ├── logo.svg
    │   └── App.test.js
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env
    └── .gitignore
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
 (`/api/auth`)

#### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "607f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://api.example.com/avatars/default.png",
    "isOnline": false
  }
}
```

#### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "607f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://api.example.com/avatars/johndoe.png",
    "isOnline": true
  }
}
```

#### 3. Logout User
```
POST /api/auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Users (`/api/users`)

#### 1. Get All Users (Excluding Current User)
```
GET /api/users
Authorization: Bearer {token}

Query Parameters (optional):
- page: 1 (default)
- limit: 20 (default)

Response (200 OK):
{
  "success": true,
  "count": 15,
  "users": [
    {
      "_id": "607f1f77bcf86cd799439012",
      "username": "janedoe",
      "email": "jane@example.com",
      "avatar": "https://api.example.com/avatars/janedoe.png",
      "isOnline": true,
      "lastSeen": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

#### 2. Get Online Users
```
GET /api/users/online
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "onlineCount": 8,
  "users": [
    {
      "_id": "607f1f77bcf86cd799439012",
      "username": "janedoe",
      "avatar": "https://api.example.com/avatars/janedoe.png",
      "isOnline": true,
      "connectedAt": "2024-01-15T10:15:00Z"
    },
    ...
  ]
}
```

#### 3. Search Users
```
GET /api/users/search?query=john
Authorization: Bearer {token}

Query Parameters:
- query: "john" (search term)

Response (200 OK):
{
  "success": true,
  "results": 2,
  "users": [
    {
      "_id": "607f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "https://api.example.com/avatars/johndoe.png",
      "isOnline": true
    },
    ...
  ]
}
```

#### 4. Get User by ID
```
GET /api/users/:id
Authorization: Bearer {token}

URL Parameters:
- id: "607f1f77bcf86cd799439011"

Response (200 OK):
{
  "success": true,
  "user": {
    "_id": "607f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://api.example.com/avatars/johndoe.png",
    "isOnline": true,
    "lastSeen": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T08:00:00Z"
  }
}
```

#### 5. Get Recent Chats
```
GET /api/users/recent-chats
Authorization: Bearer {token}

Query Parameters (optional):
- limit: 10 (default)

Response (200 OK):
{
  "success": true,
  "recentChats": [
    {
      "userId": "607f1f77bcf86cd799439012",
      "username": "janedoe",
      "lastMessage": "See you tomorrow!",
      "lastMessageTime": "2024-01-15T14:20:00Z",
      "unreadCount": 2
    },
    ...
  ]
}
```

#### 6. Update User Profile
```
PUT /api/users/profile/:id
Authorization: Bearer {token}
Content-Type: application/json

URL Parameters:
- id: "607f1f77bcf86cd799439011"

Request Body:
{
  "username": "johndoe_updated",
  "avatar": "https://api.example.com/avatars/new_avatar.png",
  "status": "Available"
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "607f1f77bcf86cd799439011",
    "username": "johndoe_updated",
    "avatar": "https://api.example.com/avatars/new_avatar.png",
    "status": "Available"
  }
}
```

---

### Messages (`/api/messages`)

#### 1. Get Private Messages with User
```
GET /api/messages/private/:userId
Authorization: Bearer {token}

URL Parameters:
- userId: "607f1f77bcf86cd799439012"

Query Parameters (optional):
- page: 1 (default)
- limit: 50 (default)

Response (200 OK):
{
  "success": true,
  "total": 125,
  "messages": [
    {
      "_id": "607f1f77bcf86cd799439100",
      "content": "Hey! How are you?",
      "sender": {
        "_id": "607f1f77bcf86cd799439011",
        "username": "johndoe"
      },
      "receiver": {
        "_id": "607f1f77bcf86cd799439012",
        "username": "janedoe"
      },
      "timestamp": "2024-01-15T10:20:00Z",
      "isRead": true
    },
    ...
  ]
}
```

#### 2. Get Room Messages
```
GET /api/messages/room/:roomId
Authorization: Bearer {token}

URL Parameters:
- roomId: "607f1f77bcf86cd799439050"

Query Parameters (optional):
- page: 1 (default)
- limit: 50 (default)

Response (200 OK):
{
  "success": true,
  "total": 342,
  "roomName": "Project Team",
  "messages": [
    {
      "_id": "607f1f77bcf86cd799439101",
      "content": "Meeting notes attached",
      "sender": {
        "_id": "607f1f77bcf86cd799439011",
        "username": "johndoe",
        "avatar": "https://api.example.com/avatars/johndoe.png"
      },
      "room": "607f1f77bcf86cd799439050",
      "timestamp": "2024-01-15T11:00:00Z",
      "readBy": ["607f1f77bcf86cd799439012", "607f1f77bcf86cd799439013"]
    },
    ...
  ]
}
```

#### 3. Get Chat History (Paginated)
```
GET /api/messages/history
Authorization: Bearer {token}

Query Parameters:
- page: 1 (default)
- limit: 30 (default)
- type: "all" | "private" | "room" (default: "all")

Response (200 OK):
{
  "success": true,
  "total": 567,
  "page": 1,
  "pages": 19,
  "messages": [
    {
      "_id": "607f1f77bcf86cd799439102",
      "content": "Message content here",
      "sender": "johndoe",
      "timestamp": "2024-01-15T12:15:00Z",
      "type": "private"
    },
    ...
  ]
}
```

#### 4. Mark Message as Read
```
PUT /api/messages/read/:messageId
Authorization: Bearer {token}

URL Parameters:
- messageId: "607f1f77bcf86cd799439100"

Response (200 OK):
{
  "success": true,
  "message": "Message marked as read",
  "messageId": "607f1f77bcf86cd799439100"
}
```

#### 5. Send Message
```
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "content": "Hello, how are you?",
  "receiverId": "607f1f77bcf86cd799439012",
  "roomId": null
}

Response (201 Created):
{
  "success": true,
  "message": {
    "_id": "607f1f77bcf86cd799439103",
    "content": "Hello, how are you?",
    "sender": "607f1f77bcf86cd799439011",
    "receiver": "607f1f77bcf86cd799439012",
    "timestamp": "2024-01-15T13:45:00Z",
    "isRead": false
  }
}
```

#### 6. Delete Message
```
DELETE /api/messages/:messageId
Authorization: Bearer {token}

URL Parameters:
- messageId: "607f1f77bcf86cd799439100"

Response (200 OK):
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

### Rooms (`/api/rooms`)

#### 1. Get All Rooms
```
GET /api/rooms
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "rooms": [
    {
      "_id": "607f1f77bcf86cd799439050",
      "name": "Project Team",
      "description": "Discussion for Q1 project",
      "members": 5,
      "createdBy": "607f1f77bcf86cd799439011",
      "createdAt": "2024-01-10T08:00:00Z"
    },
    ...
  ]
}
```

#### 2. Create Room
```
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "New Team",
  "description": "New team collaboration room"
}

Response (201 Created):
{
  "success": true,
  "room": {
    "_id": "607f1f77bcf86cd799439051",
    "name": "New Team",
    "description": "New team collaboration room",
    "members": 1,
    "createdBy": "607f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T14:00:00Z"
  }
}
```

#### 3. Join Room
```
POST /api/rooms/:roomId/join
Authorization: Bearer {token}

URL Parameters:
- roomId: "607f1f77bcf86cd799439050"

Response (200 OK):
{
  "success": true,
  "message": "Joined room successfully"
}
```

#### 4. Leave Room
```
POST /api/rooms/:roomId/leave
Authorization: Bearer {token}

URL Parameters:
- roomId: "607f1f77bcf86cd799439050"

Response (200 OK):
{
  "success": true,
  "message": "Left room successfully"
}
```

---

### Socket.IO Events

#### Client → Server Events
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `typing` - User is typing
- `stop-typing` - User stopped typing

#### Server → Client Events
- `user-joined` - User joined the room
- `user-left` - User left the room
- `new-message` - Receive new message
- `user-typing` - Another user is typing
- `user-online` - User came online
- `user-offline` - User went offline
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
