# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

## One-Time Setup

### 1. Backend Setup
```bash
cd chat/backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat_app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 2. Frontend Setup
```bash
cd chat/frontend
npm install
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Terminal 1 - Start MongoDB
```bash
mongod
```

### Terminal 2 - Start Backend
```bash
cd chat/backend
npm start
# or with auto-reload: npm run dev
```
Server runs on: `http://localhost:5000`

### Terminal 3 - Start Frontend
```bash
cd chat/frontend
npm start
```
App opens on: `http://localhost:3000`

## First Login

1. Go to `http://localhost:3000`
2. Click "Register" to create an account
3. Fill in username, email, and password
4. Login with your credentials
5. Start chatting!

## Features to Try

- **Global Chat**: All connected users can see messages
- **Private Chat**: Click on a user to start private messaging
- **Typing Indicator**: See when others are typing
- **Online Status**: Green dot shows who's online
- **Recent Chats**: Quick access to previous conversations

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to MongoDB | Make sure `mongod` is running |
| "Authentication error" in Socket | Check JWT_SECRET matches in backend .env |
| Frontend can't reach backend | Verify backend is running on port 5000 |
| Messages not sending | Check browser console for errors |
| CORS errors | Verify CORS_ORIGIN in .env matches frontend URL |

## Key Files

```
Backend:
- server.js - Main server file
- sockets/socketHandler.js - Real-time message handling
- controllers/ - Route controllers
- models/ - MongoDB schemas

Frontend:
- components/Chat.js - Main chat interface
- context/SocketContext.js - Socket.IO connection
- context/AuthContext.js - Authentication state
```

## Environment Checklist

- [ ] MongoDB running locally or connected to Atlas
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] JWT_SECRET set in backend .env
- [ ] CORS_ORIGIN set to http://localhost:3000

## API Documentation

See main README.md for complete API endpoint documentation.

## Support

For detailed setup instructions and feature documentation, see `README.md`
