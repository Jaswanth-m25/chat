import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { FiX, FiCamera, FiEdit2, FiCheck } from 'react-icons/fi';
import './Profile.css';

export const Profile = ({ userId = null, isModal = false, onClose = null }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

useEffect(() => {
  fetchProfile();
}, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserById(profileUserId);
      setProfile(response.data);
      setFormData({
        username: response.data.username || '',
        bio: response.data.bio || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePic', file);

      const response = await userService.uploadProfilePicture(profileUserId, formData);
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await userService.updateProfile(profileUserId, formData);
      setProfile(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className={`profile-container ${isModal ? 'profile-modal' : ''}`}>
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`profile-container ${isModal ? 'profile-modal' : ''}`}>
        <div className="profile-error">Profile not found</div>
      </div>
    );
  }

  const containerClass = isModal ? 'profile-modal-wrapper' : 'profile-page-wrapper';

  return (
    <div className={containerClass}>
      {isModal && (
        <div className="profile-modal-header">
          {/* <h2>User Profile</h2> */}
          <button className="profile-close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
      )}

      <div className={`profile-container ${isModal ? 'profile-modal' : ''}`}>
        {/* Profile Header */}
        <div className="profile-header">
<div className="profile-avatar-container">

  {profile.avatar ? (

    <img
      src={profile.avatar}
      alt={profile.username}
      className="profile-avatar"
    />

  ) : (

    <div className="profile-avatar-placeholder">
      {profile.username?.[0]?.toUpperCase()}
    </div>

  )}

  {isOwnProfile && (
    <button
      className="profile-camera-btn"
      onClick={() => fileInputRef.current?.click()}
      disabled={uploading}
      title="Change profile picture"
    >
      <FiCamera size={20} />
    </button>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleFileSelect}
    style={{ display: 'none' }}
    disabled={uploading}
  />

</div>

          <div className="profile-info">
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleEditChange}
                className="profile-username-input"
                maxLength="30"
              />
            ) : (
              <h1 className="profile-username">{profile.username}</h1>
            )}
            
            <p className="profile-email">{profile.email}</p>
            
            <div className="profile-status">
              <span className={`status-badge ${profile.status}`}>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <div className="profile-edit-btn-container">
              {isEditing ? (
                <button className="btn-save" onClick={handleSaveProfile}>
                  <FiCheck size={18} /> Save
                </button>
              ) : (
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  <FiEdit2 size={18} /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bio Section */}
        <div className="profile-bio-section">
          <h3>About</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleEditChange}
              className="profile-bio-input"
              placeholder="Add a bio..."
              maxLength="200"
              rows="4"
            />
          ) : (
            <p className="profile-bio">
              {profile.bio || 'No bio added yet'}
            </p>
          )}
          {isEditing && (
            <small className="char-count">{formData.bio.length}/200</small>
          )}
        </div>

        {/* Member Since */}
        <div className="profile-stats">
          <div className="stat-item">
            <label>Member Since</label>
            <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="stat-item">
            <label>Last Updated</label>
            <p>{new Date(profile.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
