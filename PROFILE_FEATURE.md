# Profile Feature Implementation Guide

## Overview
Each user now has a profile page with the ability to upload a profile picture. While chatting with someone, you can view their profile with a single click.

## Features

### 1. **Profile Page**
- Display user avatar, username, email, and status
- Show bio/description
- Display member since and last updated dates
- Edit your own profile information

### 2. **Profile Picture Upload**
- Click the camera icon on your avatar
- Select an image file (JPG, PNG, GIF, WebP)
- Max file size: 5MB
- Old picture automatically deleted when new one is uploaded

### 3. **View User Profile While Chatting**
- Open a private chat with someone
- Click "View Profile" button in the chat header
- See their profile in a modal overlay
- Close the modal to continue chatting

## Backend Setup

### Required Packages
All packages are already installed in `package.json`:
- `multer` - File upload handling

### New Endpoints
- `POST /api/users/upload-profile-pic/:id` - Upload profile picture
- `PUT /api/users/profile/:id` - Update profile info
- `GET /api/users/:id` - Get user profile

### File Storage
- Profile pictures are stored in: `backend/uploads/`
- Served statically at: `http://localhost:5000/uploads/`

### Database Schema
The User model now includes:
```javascript
{
  avatar: String,        // URL to profile picture
  bio: String,          // User bio (max 200 chars)
  // ... other fields
}
```

## Frontend Usage

### View Your Profile
In the Chat component, click on your profile info in the sidebar to see your full profile.

### View Someone Else's Profile
1. Start a private chat
2. Click the "View Profile" button in the chat header
3. Their profile appears in a modal
4. Click the X or outside the modal to close

### Edit Your Profile
1. Open your profile
2. Click "Edit Profile"
3. Modify your username and/or bio
4. Click "Save"

### Upload Profile Picture
1. Open your profile
2. Click the camera icon on your avatar
3. Select an image file
4. Picture uploads automatically

## Component Files

### Profile Component (`src/components/Profile.jsx`)
- Displays user profile information
- Handles profile picture upload
- Allows editing of profile data
- Works as both page and modal

### Profile Styles (`src/components/Profile.css`)
- Modern styling for profile
- Responsive design
- Modal and page view modes

### Integration with Chat (`src/components/Chat.jsx`)
- Profile modal state management
- "View Profile" button in private chats
- Profile modal overlay

## API Integration

### Upload Profile Picture
```javascript
const response = await userService.uploadProfilePicture(userId, formData);
// Returns: { user: { ...userData, avatar: "/uploads/profile-xxx.jpg" } }
```

### Update Profile Info
```javascript
const response = await userService.updateProfile(userId, { username, bio });
// Returns: { user: { ...userData } }
```

### Get User Profile
```javascript
const response = await userService.getUserById(userId);
// Returns: user object with all profile data
```

## Styling

### Colors (from Chat theme)
- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Green) - Online
- Warning: `#f57c00` (Orange) - Away
- Text: `#f8fafc` (Light)

### Responsive Breakpoints
- Desktop: Full profile view
- Tablet (768px): Adjusted layout
- Mobile (480px): Compact view with modal optimization

## Troubleshooting

### Profile Picture Not Uploading
1. Check file size (max 5MB)
2. Verify file format (JPG, PNG, GIF, WebP)
3. Ensure backend is running
4. Check browser console for errors

### Profile Picture Not Displaying
1. Verify backend server is running
2. Check `/uploads` directory exists
3. Ensure correct file permissions
4. Check network tab in browser dev tools

### Bio Not Saving
1. Check character count (max 200)
2. Ensure you clicked "Save" button
3. Verify server response in console
4. Check MongoDB connection

## Future Enhancements
- Avatar crop tool
- Profile theme customization
- User badges/achievements
- Last seen timestamp
- Bio markdown support
- Profile visibility settings
