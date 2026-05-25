# Architecture and Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                      │
│                    (React Application)                      │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         │ HTTP (HTTPS)                       │ WebSocket
         │ REST API                           │ Socket.IO
         │                                    │
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                           │
│  - Request Handling                                         │
│  - JWT Authentication                                       │
│  - WebSocket Connection Management                          │
│  - Real-time Message Broadcasting                           │
└─────────────────────────────────────────────────────────────┘
         │
         │ Mongoose ORM
         │
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                           │
│  - Users Collection                                         │
│  - Messages Collection                                      │
│  - Rooms Collection                                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Backend Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection config
├── controllers/
│   ├── authController.js    # Auth logic (register, login)
│   ├── userController.js    # User operations
│   ├── messageController.js # Message operations
│   └── roomController.js    # Room operations
├── middleware/
│   ├── auth.js              # JWT verification
│   └── validators.js        # Input validation
├── models/
│   ├── User.js              # User schema
│   ├── Message.js           # Message schema
│   └── Room.js              # Room schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── messages.js          # Message routes
│   └── rooms.js             # Room routes
├── sockets/
│   └── socketHandler.js     # WebSocket handlers
├── server.js                # Main entry point
├── .env                     # Environment variables
└── package.json             # Dependencies
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── Auth.js              # Login/Register components
│   ├── Auth.css             # Auth styling
│   ├── Chat.js              # Main chat component
│   └── Chat.css             # Chat styling
├── context/
│   ├── AuthContext.js       # Auth state management
│   └── SocketContext.js     # Socket state management
├── services/
│   └── api.js               # API service layer
├── App.js                   # Root component
├── App.css                  # App styling
├── index.js                 # React entry point
├── index.css                # Global styles
└── package.json             # Dependencies
```

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  email: String (unique, lowercase),
  password: String (hashed),
  avatar: String,
  status: Enum['online', 'offline', 'away'],
  isTyping: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Schema
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User) - null for global/room messages,
  roomId: ObjectId (ref: Room) - null for private messages,
  content: String,
  messageType: Enum['text', 'image', 'file'],
  isRead: Boolean,
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Room Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  roomType: Enum['group', 'private'],
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Flow

### Authentication Flow
```
1. User enters credentials
   ↓
2. Frontend sends POST /api/auth/register or /api/auth/login
   ↓
3. Backend validates input
   ↓
4. Backend hashes password (bcryptjs)
   ↓
5. Backend creates/finds user in MongoDB
   ↓
6. Backend generates JWT token
   ↓
7. Frontend stores token in localStorage
   ↓
8. Frontend sets Authorization header for future requests
```

### Message Flow (Private Chat)
```
1. User types and sends message
   ↓
2. Frontend emits 'privateMessage' event via Socket.IO
   ↓
3. Backend receives event, creates Message document
   ↓
4. Backend saves to MongoDB
   ↓
5. Backend broadcasts to both users in private room
   ↓
6. Frontend receives 'newPrivateMessage' event
   ↓
7. Frontend adds message to chat display
   ↓
8. Auto-scroll to latest message
```

### Typing Indicator Flow
```
1. User starts typing
   ↓
2. Frontend emits 'privateTyping' event
   ↓
3. Backend tracks typing user in memory
   ↓
4. Backend broadcasts typing users list
   ↓
5. Frontend receives and displays "User is typing..."
   ↓
6. 2-second inactivity timeout
   ↓
7. Frontend emits 'privateStopTyping'
   ↓
8. Backend removes from typing list
```

## State Management

### Frontend State Architecture

```
AuthContext
├── user
├── token
├── loading
├── register()
├── login()
├── logout()
└── setUser()

SocketContext
├── socket
├── onlineUsers
├── typingUsers
└── connection listeners
   ├── onlineUsers
   ├── privateUserTyping
   ├── roomUsersTyping
   ├── newPrivateMessage
   ├── newRoomMessage
   └── messageNotification
```

### Local Component State

```
ChatApp Component
├── activeChat
├── message
├── messages
├── users
├── recentChats
├── rooms
├── isTyping
├── typingUsers
└── showUserList
```

## Security Implementation

### Password Security
- Bcryptjs hashing with salt rounds: 10
- Never stored in plain text
- Salted hashing prevents rainbow table attacks

### Authentication
- JWT tokens issued on successful login/register
- Token includes: user ID, email, username
- Token expiration: 7 days (configurable)
- Tokens stored in localStorage

### Authorization
- Protected routes check for valid token
- JWT middleware validates token signature
- Expired tokens trigger re-authentication

### API Security
- CORS enabled for frontend only
- Input validation on all endpoints
- Rate limiting (recommended for production)
- HTTPS enforcement (recommended for production)

## Real-Time Features

### Socket.IO Connection
- Authentication via token in socket handshake
- Namespace: default (/)
- Transports: WebSocket, HTTP long-polling

### Event Broadcasting Patterns

**Global Broadcast**
```
io.emit('event', data)  // All connected users
```

**Targeted Broadcast**
```
socket.to('room-name').emit('event', data)  // Specific room
```

**Room-based**
```
socket.join('room-name')      // Join room
socket.leave('room-name')     // Leave room
io.to('room-name').emit()     // Broadcast to room
```

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields:
  - User.email
  - User.username
  - Message.senderId
  - Message.roomId
  - Message.createdAt (for sorting)

### Query Optimization
- Pagination for message history
- Aggregation for recent chats
- Lazy loading of user lists

### Frontend Optimization
- Component memoization (React.memo)
- Lazy loading of message history
- Virtual scrolling for long lists (future enhancement)

### Backend Optimization
- Connection pooling (MongoDB)
- Caching frequently accessed data (future: Redis)
- Load balancing across multiple instances (production)

## Scalability Strategy

### Horizontal Scaling
- Multiple Express servers behind load balancer
- Shared session store (Redis)
- MongoDB sharding for large datasets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Cache frequently accessed data

### Microservices (Future)
- Auth service
- Message service
- User service
- Notification service

## Error Handling

### Backend Error Flow
```
Request
   ↓
Middleware validation
   ↓
Controller logic
   ↓
If error: catch block
   ↓
Log error
   ↓
Send error response with status code
   ↓
Global error handler middleware
```

### Frontend Error Flow
```
API Call / Socket Event
   ↓
Try-catch block
   ↓
If error: show to user
   ↓
Log to console
   ↓
Display error message or retry option
```

## WebSocket Message Types

### Connection Events
- `connect` - Client connected
- `disconnect` - Client disconnected
- `onlineUsers` - List of online users
- `userOffline` - User went offline

### Chat Events
- `globalMessage`, `newGlobalMessage`
- `privateMessage`, `newPrivateMessage`
- `roomMessage`, `newRoomMessage`

### Presence Events
- `globalTyping`, `globalStopTyping`, `usersTyping`
- `privateTyping`, `privateStopTyping`, `privateUserTyping`
- `roomTyping`, `roomStopTyping`, `roomUsersTyping`

### Utility Events
- `messageNotification`
- `messageReadReceipt`
- `error`

## Testing Strategy

### Unit Tests
- Controller functions
- Validation functions
- Utility functions

### Integration Tests
- API endpoints
- Socket events
- Database operations

### E2E Tests
- User registration flow
- Login flow
- Message sending flow
- Typing indicators

## Deployment Architecture

### Production Setup
```
                 CDN
                  │
         ┌────────┴────────┐
         │                 │
    Load Balancer      Nginx
         │                 │
    ┌────┴────┐        ┌───┴────┐
    │          │        │        │
 Express1   Express2  React1   React2
    │          │        └───┬────┘
    └────┬────┘            │
         │            (Static files)
    MongoDB Cluster
```

## Monitoring and Logging

### Backend Logging
- Request/response logging
- Error logging with stack traces
- Socket event logging
- Database query logging

### Frontend Logging
- API call logging
- Socket event logging
- Error logging
- Performance metrics

### Production Monitoring
- Application Performance Monitoring (APM)
- Database performance
- Server resource usage
- Real-time alerts

## Version Control Strategy

```
main (production)
  ├── develop (staging)
  │   ├── feature/auth
  │   ├── feature/messaging
  │   ├── feature/typing-indicators
  │   ├── feature/rooms
  │   └── fix/socket-connection
  └── tags
      ├── v1.0.0
      ├── v1.1.0
      └── v1.2.0
```

---

This architecture provides a scalable, maintainable foundation for the chat application with room for growth and optimization.
