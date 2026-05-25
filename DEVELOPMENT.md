# Development Workflow Guide

## Setting Up Your Development Environment

### Recommended Tools
- **IDE**: VS Code
- **Terminal**: PowerShell (Windows), Bash (macOS/Linux)
- **Database GUI**: MongoDB Compass
- **API Testing**: Postman
- **Version Control**: Git

### VS Code Extensions
```
- ES7+ React/Redux/React-Native snippets
- JavaScript (ES6) code snippets
- Prettier - Code formatter
- ESLint
- Postman
- Thunder Client (or REST Client)
- MongoDB for VS Code
```

### First-Time Developer Setup

1. **Clone/Extract Project**
```bash
cd chat
```

2. **Run Setup Script**
```bash
# macOS/Linux
chmod +x setup.sh
./setup.sh

# Windows
setup.bat
```

3. **Verify Setup**
```bash
# Check Node version
node -v

# Check npm version
npm -v

# Check MongoDB
mongod --version
```

## Daily Development Workflow

### Starting Development Session

**Terminal 1 - MongoDB**
```bash
mongod
```

**Terminal 2 - Backend**
```bash
cd chat/backend
npm run dev  # With auto-reload
```

**Terminal 3 - Frontend**
```bash
cd chat/frontend
npm start
```

### Before You Start Coding

1. **Pull Latest Changes**
```bash
git pull origin main
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Install Dependencies**
```bash
npm install
```

## Code Organization

### Adding New Features

#### 1. Backend - Add New API Endpoint

**Create Model** (if needed)
```javascript
// models/NewFeature.js
const schema = new mongoose.Schema({
  // fields
});
module.exports = mongoose.model('NewFeature', schema);
```

**Create Controller**
```javascript
// controllers/newFeatureController.js
exports.getFeature = async (req, res) => {
  try {
    // logic
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Create Route**
```javascript
// routes/newFeature.js
router.get('/', authenticateToken, newFeatureController.getFeature);
```

**Register Route** in `server.js`
```javascript
app.use('/api/newfeature', require('./routes/newFeature'));
```

#### 2. Frontend - Add New Component

**Create Component**
```javascript
// components/NewComponent.js
import React, { useState } from 'react';
import './NewComponent.css';

export const NewComponent = () => {
  // component logic
  return <div>Component</div>;
};
```

**Create Styles**
```css
/* components/NewComponent.css */
.component-class {
  /* styles */
}
```

**Use Component**
```javascript
import { NewComponent } from './components/NewComponent';

<NewComponent />
```

#### 3. Add Socket Event

**Server Side**
```javascript
// sockets/socketHandler.js
socket.on('newEvent', (data) => {
  // Handle event
  io.emit('eventResponse', result);
});
```

**Client Side**
```javascript
// In React component
socket.emit('newEvent', data);

socket.on('eventResponse', (result) => {
  // Handle response
});
```

## Testing Your Changes

### Manual Testing

1. **Test API Endpoint**
```bash
# Use Postman or curl
curl -X GET http://localhost:5000/api/endpoint \
  -H "Authorization: Bearer TOKEN"
```

2. **Test Socket Event**
```javascript
// Browser console
socket.emit('eventName', {data});
socket.on('eventResponse', (data) => console.log(data));
```

3. **Test Frontend Component**
- Navigate to the page
- Click through UI
- Check browser console for errors

### Debugging

**Backend Debugging**
```javascript
// Add console logs
console.log('Variable:', variable);
console.log('Error:', error);

// Use debugger
node --inspect-brk server.js
```

**Frontend Debugging**
```javascript
// DevTools (F12)
// React DevTools extension
// Console.log()
console.log('State:', state);
```

## Version Control Workflow

### Before Committing

1. **Code Quality**
```bash
# Format code
npx prettier --write .

# Check for linting errors
npm run lint  # if configured
```

2. **Test Changes**
```bash
# Run tests
npm test

# Manual testing
```

### Committing Changes

**Good Commit Messages**
```bash
# Feature
git commit -m "feat: add typing indicator feature"

# Bug fix
git commit -m "fix: resolve socket connection issue"

# Refactor
git commit -m "refactor: improve message handler structure"

# Documentation
git commit -m "docs: update API documentation"
```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Make changes and test
# ... code ...

# 3. Stage changes
git add .
git add src/specific/file.js  # Or specific files

# 4. Commit
git commit -m "feat: add feature description"

# 5. Push to GitHub
git push origin feature/feature-name

# 6. Create Pull Request
# On GitHub, create PR from feature branch to main

# 7. After PR approval, merge to main
# 8. Delete feature branch
git branch -d feature/feature-name
```

## Database Management

### Viewing Data

**MongoDB Compass (GUI)**
- Download: https://www.mongodb.com/products/compass
- Connect to MongoDB
- Browse collections
- View and edit documents

**Command Line**
```bash
# Connect to MongoDB
mongo

# Select database
use chat_app

# View collections
show collections

# View documents
db.users.find()
db.messages.find()

# Query examples
db.messages.find({ senderId: ObjectId("...") })
db.users.find({ status: "online" })
```

### Database Maintenance

**Create Indexes**
```bash
# For performance
db.messages.createIndex({ createdAt: -1 });
db.messages.createIndex({ senderId: 1 });
db.users.createIndex({ email: 1 });
```

**Backup Data**
```bash
# Backup
mongodump --uri "mongodb://localhost:27017/chat_app" --out ./backup

# Restore
mongorestore ./backup
```

## Performance Testing

### Frontend Performance

```javascript
// In browser console
performance.mark('start');
// ... code to test ...
performance.mark('end');
performance.measure('test', 'start', 'end');
console.log(performance.getEntriesByName('test')[0]);
```

### Backend Performance

```javascript
console.time('operationName');
// ... code to test ...
console.timeEnd('operationName');
```

## Documentation Updates

### When to Document

- [ ] New features added
- [ ] API endpoint created
- [ ] Architecture changed
- [ ] External dependencies added
- [ ] Complex logic implemented

### What to Document

```javascript
/**
 * Description of function
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * @example
 * functionName(param) // returns value
 */
function functionName(paramName) {
  // code
}
```

## Code Review Checklist

- [ ] Code follows project conventions
- [ ] Functions are documented
- [ ] Error handling is implemented
- [ ] No console.log in production code
- [ ] No hardcoded values
- [ ] Tests are passing
- [ ] No breaking changes
- [ ] Accessibility considered
- [ ] Performance optimized

## Environment Management

### Development (.env)
```
NODE_ENV=development
DEBUG=true
MONGODB_URI=mongodb://localhost:27017/chat_app
```

### Staging (.env.staging)
```
NODE_ENV=staging
MONGODB_URI=mongodb+srv://user:pass@staging.mongodb.net/chat_app
```

### Production (.env.production)
```
NODE_ENV=production
DEBUG=false
MONGODB_URI=mongodb+srv://user:pass@production.mongodb.net/chat_app
```

## Keeping Up with Updates

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Major version update (be careful)
npm install package-name@next
```

### Security Audits

```bash
# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Review changes before auto-fix
npm audit fix --dry-run
```

## Team Development

### Working with Others

1. **Communicate Changes**
   - Discuss features before coding
   - Use PRs for code review
   - Document decisions

2. **Conflict Resolution**
```bash
# If merge conflict occurs
git status  # See conflicts
# Edit files to resolve
git add .
git commit -m "resolve: merge conflicts"
git push
```

3. **Code Standards**
   - Use consistent naming
   - Follow project structure
   - Comment complex code
   - Test thoroughly

## Deployment Preparation

### Before Deploying

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Create production build
npm run build

# 3. Test build locally
npm run preview  # or serve

# 4. Tag release
git tag v1.0.0
git push origin v1.0.0

# 5. Deploy
# Follow DEPLOYMENT.md
```

## Common Development Tasks

### Clear Cache and Reinstall

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Reset Database

```bash
# Use MongoDB Compass or CLI
# Delete collection
db.messages.deleteMany({})
db.users.deleteMany({})
```

### Quick Local Testing

```bash
# Create test users
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

## Development Resources

### Online Resources
- [MDN Web Docs](https://developer.mozilla.org)
- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Socket.IO Documentation](https://socket.io/docs)

### Community
- Stack Overflow
- GitHub Issues
- Dev community forums

## Productivity Tips

1. **Use Hot Reload**
   - Backend: `npm run dev` (with nodemon)
   - Frontend: `npm start` (built-in)

2. **DevTools**
   - Browser DevTools (F12)
   - React DevTools
   - Redux DevTools

3. **Code Snippets**
   - Save common patterns
   - Use VS Code snippets

4. **Terminal Shortcuts**
```bash
# Up arrow - previous command
# Tab - autocomplete
# Ctrl+C - stop process
# Ctrl+L - clear terminal
```

## Development Best Practices

1. **Write Clean Code**
   - Clear variable names
   - Short functions
   - DRY principle

2. **Test Early**
   - Test as you code
   - Don't wait until end

3. **Commit Often**
   - Small, logical commits
   - Easy to revert if needed

4. **Document As You Go**
   - Comments for complex logic
   - Update docs with changes

5. **Keep Learning**
   - Follow tech blogs
   - Try new tools
   - Share knowledge

---

Happy coding! 🚀
