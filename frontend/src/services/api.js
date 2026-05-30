import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://chat-backend-da9m.onrender.com/api';

export const userService = {
  getAllUsers: () => axios.get(`${API_URL}/users`),
  getOnlineUsers: () => axios.get(`${API_URL}/users/online`),
  searchUsers: (query) => axios.get(`${API_URL}/users/search?query=${query}`),
  getUserById: (id) => axios.get(`${API_URL}/users/${id}`),
  getRecentChats: () => axios.get(`${API_URL}/users/recent-chats`),
  updateProfile: (id, data) => axios.put(`${API_URL}/users/profile/${id}`, data),
  uploadProfilePicture: (id, formData) => axios.post(`${API_URL}/users/upload-profile-pic/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const messageService = {
  getPrivateMessages: (currentUserId, userId) =>
  axios.get(
    `${API_URL}/messages/private/${currentUserId}/${userId}`
  ),
  getRoomMessages: (roomId) => axios.get(`${API_URL}/messages/room/${roomId}`),
  getChatHistory: (params) => axios.get(`${API_URL}/messages/history`, { params }),
  markAsRead: (messageId) => axios.put(`${API_URL}/messages/read/${messageId}`),
clearChat: (userId) =>
  axios.delete(
    `${API_URL}/messages/clear/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  ),
  deleteMessage: (messageId) =>
  axios.delete(
    `${API_URL}/messages/message/${messageId}`
  ),
  uploadFile: (formData) => axios.post(`${API_URL}/messages/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const roomService = {
  createRoom: (data) => axios.post(`${API_URL}/rooms`, data),
  getAllRooms: () => axios.get(`${API_URL}/rooms`),
  getRoomById: (id) => axios.get(`${API_URL}/rooms/${id}`),
  addMember: (id, userId) => axios.post(`${API_URL}/rooms/${id}/add-member`, { userId }),
  removeMember: (id, userId) => axios.delete(`${API_URL}/rooms/${id}/remove-member`, { data: { userId } }),
  deleteRoom: (id) => axios.delete(`${API_URL}/rooms/${id}`)
};
