const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const authenticateToken = require('../middleware/auth');
const multer = require('multer');
// Configure multer for profile picture uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'chat-app-profiles',
      resource_type: 'image'
    };
  }
});
const upload = multer({
  storage 
});

// Get all users
router.get('/', userController.getAllUsers);

// Get online users
router.get('/online', userController.getOnlineUsers);

// Search users
router.get('/search', userController.searchUsers);

// Get recent chats
router.get('/recent-chats', userController.getRecentChats);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update profile
router.put('/profile/:id',userController.updateProfile);

// Upload profile picture
router.post('/upload-profile-pic/:id', upload.single('profilePic'), userController.uploadProfilePicture);
module.exports = router;
