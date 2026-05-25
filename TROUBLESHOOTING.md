# Common Issues & Troubleshooting Guide

## Connection Issues

### Backend Won't Start

**Error**: `Port 5000 already in use`
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Error**: `MongoDB connection refused`
- [ ] MongoDB service is running
- [ ] Connection string is correct
- [ ] MongoDB Atlas credentials are valid
- [ ] Network access is allowed (for Atlas)

```bash
# Start MongoDB locally
mongod

# Test connection
mongo "mongodb://localhost:27017"
```

### Frontend Won't Start

**Error**: `npm: command not found`
- [ ] Node.js is installed
- [ ] npm is installed with Node.js
- [ ] Restart terminal after installation

**Error**: `Port 3000 already in use`
```bash
# Same as backend - find and kill process
```

**Error**: `Cannot find module`
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Authentication Issues

### "Invalid Email or Password"

**Causes**:
- [ ] Typo in email or password
- [ ] Account doesn't exist
- [ ] Password is case-sensitive

**Solution**: Try resetting account info or creating new account

### "Authentication Error" in Console

**Causes**:
- [ ] JWT_SECRET mismatch between sessions
- [ ] Token expired
- [ ] Invalid token format

**Solution**:
```bash
# Clear localStorage
localStorage.clear()
# Refresh and login again
```

### "Access token required" API Error

**Causes**:
- [ ] Token not sent in Authorization header
- [ ] Token missing from localStorage
- [ ] Session ended

**Solution**:
- Login again
- Check network request headers
- Clear browser cache

## Socket.IO Connection Issues

### Socket Connection Fails

**Causes**:
- [ ] Backend not running
- [ ] Wrong socket URL in .env
- [ ] CORS not configured
- [ ] Firewall blocking connection

**Debug**:
```javascript
// Open browser console
socket.on('connect_error', (error) => {
  console.log('Socket error:', error);
});
```

**Solution**:
```env
# .env file - verify these
REACT_APP_SOCKET_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
```

### Messages Not Appearing in Real-Time

**Causes**:
- [ ] Socket disconnected
- [ ] Event name mismatch
- [ ] Message not emitted correctly
- [ ] Browser console errors

**Debug**:
```javascript
// In browser console
socket.off(); // Disconnect
socket.connect(); // Reconnect
```

**Check Connection**:
```javascript
console.log('Connected:', socket.connected);
console.log('Socket ID:', socket.id);
```

## Database Issues

### MongoDB Connection Timeout

**Causes**:
- [ ] MongoDB Atlas network access not configured
- [ ] Connection string outdated
- [ ] Network connectivity issues

**Solution**:
```javascript
// Check connection
// In MongoDB Atlas Dashboard
Settings → Network Access → Add your IP
```

### No Data in Database After Sending Messages

**Causes**:
- [ ] Messages collection not created
- [ ] Database name mismatch
- [ ] Permission issues

**Solution**:
```bash
# Connect and check
mongo "mongodb://localhost:27017/chat_app"
# Show collections
show collections
```

## API Issues

### 404 Not Found Errors

**Causes**:
- [ ] API route not defined
- [ ] Typo in endpoint URL
- [ ] Backend not running

**Solution**: Check backend routes are correctly defined

### 500 Internal Server Error

**Causes**:
- [ ] Database connection error
- [ ] Code error in controller
- [ ] Missing required fields

**Debug**:
```bash
# Check backend console for error details
# Look for stack trace
```

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Causes**:
- [ ] CORS_ORIGIN doesn't match frontend URL
- [ ] CORS middleware not configured

**Solution**:
```env
# backend/.env
CORS_ORIGIN=http://localhost:3000
```

## Frontend Issues

### Blank Page After Login

**Causes**:
- [ ] React not compiled
- [ ] Token not stored
- [ ] Router misconfigured

**Debug**:
```javascript
// Browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

**Solution**:
```bash
cd frontend
npm start
# Wait for compilation
```

### Styling Issues

**Causes**:
- [ ] CSS file not imported
- [ ] CSS not loading
- [ ] Cache issues

**Solution**:
```bash
# Clear cache and restart
rm -rf build
npm start
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Profile Picture Not Showing

**Causes**:
- [ ] Avatar field not populated
- [ ] Avatar URL invalid

**Solution**:
- Update profile with avatar URL
- Check avatar field in database

## Network Issues

### Localhost vs 127.0.0.1

**Problem**: Some systems treat these differently

**Solution**: Use consistent URL
```env
# Use localhost for both
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Firewall Issues

**Problem**: Can't connect across devices

**Solution**: 
- [ ] Allow port 5000 in firewall
- [ ] Use machine IP instead of localhost
```bash
# Get local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig               # Windows
```

## Performance Issues

### Slow Message Loading

**Causes**:
- [ ] Large message history
- [ ] No pagination
- [ ] Database not indexed

**Solution**:
```javascript
// Implement pagination
const { limit = 50, skip = 0 } = query;
// Indexes on Message collection
db.messages.createIndex({ createdAt: -1 });
```

### High Memory Usage

**Causes**:
- [ ] Too many messages in memory
- [ ] Socket connections not cleaned
- [ ] Unfinished subscriptions

**Solution**:
- Implement message cleanup
- Proper socket disconnection

## Environment Issues

### "Cannot find .env"

**Solution**: Create .env file in correct directory

Backend:
```bash
chat/backend/.env
```

Frontend:
```bash
chat/frontend/.env
```

### Environment Variable Not Found

**Causes**:
- [ ] Wrong naming convention
- [ ] .env file not loaded
- [ ] Restart needed

**Solution**:
```bash
# Restart application
npm start
```

## MongoDB Atlas Specific

### Connection String Issues

```javascript
// Correct format
mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority

// Add IP to network access
// Set database user password
// Check driver/version compatibility
```

### "Authentication Failed"

**Causes**:
- [ ] Wrong username/password
- [ ] Special characters not encoded
- [ ] User doesn't exist

**Solution**: 
- Check credentials in MongoDB Atlas
- Properly encode special characters (%40 for @)

## Git Issues

### Can't Push Changes

```bash
# Check remote
git remote -v

# Add remote if missing
git remote add origin <url>

# Commit and push
git add .
git commit -m "message"
git push origin main
```

## Docker Issues

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Volume Permission Issues

```bash
# Ensure correct permissions
chmod -R 755 ./backend
chmod -R 755 ./frontend
```

## Testing Connections

### Test Backend Connection

```bash
# Verify server is running
curl http://localhost:5000

# Test endpoint
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Socket Connection

```javascript
// Browser console
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => console.log('Connected'));
socket.on('error', (error) => console.log('Error:', error));
```

### Test Database Connection

```bash
# MongoDB
mongo "mongodb://localhost:27017/chat_app"

# MongoDB Atlas
mongo "mongodb+srv://user:pass@cluster.mongodb.net/chat_app"
```

## Debugging Techniques

### Enable Debug Logging

**Backend**:
```javascript
console.log('Event:', event);
console.log('Data:', data);
```

**Frontend**:
```javascript
// In browser console
localStorage.debug = '*'
```

### Check Network Requests

- Open DevTools (F12)
- Go to Network tab
- Watch API calls
- Check headers and responses

### Monitor Socket Events

```javascript
// In browser console
socket.onAny((eventName, ...args) => {
  console.log('Event:', eventName, args);
});
```

## Performance Optimization

### Frontend Optimization

```javascript
// Use React DevTools
// Check component renders
// Profile performance
```

### Backend Optimization

```javascript
// Add indexes to MongoDB
db.users.createIndex({ email: 1 });
db.users.createIndex({ username: 1 });
db.messages.createIndex({ senderId: 1 });
```

## Getting Help

1. **Check Documentation**
   - README.md
   - ARCHITECTURE.md
   - Code comments

2. **Search Online**
   - Error message on Stack Overflow
   - Official documentation

3. **Debug Systematically**
   - Check one thing at a time
   - Use browser/server logs
   - Test components in isolation

4. **Isolate the Problem**
   - Is it frontend or backend?
   - Is it Socket or HTTP?
   - Is it database or code?

## Quick Checklist Before Asking for Help

- [ ] Error message is clear and searchable
- [ ] Checked console for stack trace
- [ ] Verified all services are running
- [ ] Checked environment variables
- [ ] Restarted application
- [ ] Cleared cache/localStorage
- [ ] Checked network connectivity
- [ ] Reviewed recent code changes

---

**Still stuck?** Review the Architecture.md and check specific module documentation.
