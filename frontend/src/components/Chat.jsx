import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { userService, messageService, roomService } from '../services/api';
import {FiSend, FiUsers, FiLogOut, FiPaperclip, FiFile, FiUser, FiSearch, FiX, FiMoreVertical } from 'react-icons/fi';
import { Profile } from './Profile';
import './Chat.css';

export const ChatApp = ({ onLogout }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [filteredRecentChats, setFilteredRecentChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userAvatars, setUserAvatars] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
    fetchRecentChats();
    fetchRooms();
    fetchUserAvatars();
  }, []);

  // Filter recent chats based on search term
  useEffect(() => {
    if (chatSearchTerm.trim() === '') {
      setFilteredRecentChats(recentChats);
    } else {
      const filtered = recentChats.filter(chat => 
        chat.userDetails?.[0]?.username?.toLowerCase().includes(chatSearchTerm.toLowerCase())
      );
      setFilteredRecentChats(filtered);
    }
  }, [chatSearchTerm, recentChats]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchUserAvatars = async () => {
    try {
      const response = await userService.getAllUsers();
      const avatars = {};
      for (const user of response.data) {
        if (user.avatar) {
          avatars[user._id] = user.avatar;
        }
      }
      setUserAvatars(avatars);
    } catch (error) {
      console.error('Failed to fetch user avatars:', error);
    }
  };

  const fetchRecentChats = async () => {
    try {
      const response = await userService.getRecentChats();
      setRecentChats(response.data);
      setFilteredRecentChats(response.data);
    } catch (error) {
      console.error('Failed to fetch recent chats:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      setRooms(response.data || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const fetchChatHistory = async (chatType, chatId) => {
    try {
      if (chatType === 'private') {
        const response = await messageService.getPrivateMessages(chatId);
        setMessages(response.data);
      } else if (chatType === 'room') {
        const response = await messageService.getRoomMessages(chatId);
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle global chat messages
  useEffect(() => {
    if (!socket) return;

    socket.on('newGlobalMessage', (msg) => {
      if (activeChat === 'global') {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('usersTyping', (users) => {
      if (activeChat === 'global') {
        setTypingUsers(users);
      }
    });

    return () => {
      socket.off('newGlobalMessage');
      socket.off('usersTyping');
    };
  }, [socket, activeChat]);

  // Handle private chat messages
  useEffect(() => {
    if (!socket) return;

socket.on('newPrivateMessage', (msg) => {

  const senderId = msg.senderId?._id || msg.senderId;
  const receiverId = msg.receiverId?._id || msg.receiverId;

  // If current chat is open
  if (
    activeChat?.type === 'private' &&
    (activeChat.userId === senderId || activeChat.userId === receiverId)
  ) {
    setMessages((prev) => [...prev, msg]);
  }
  else {
    // increase unread count
    setUnreadMessages((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1
    }));
  }
});

    socket.on('privateUserTyping', (data) => {
      if (activeChat?.type === 'private') {
        setTypingUsers(data.typingUsers || []);
      }
    });

    return () => {
      socket.off('newPrivateMessage');
      socket.off('privateUserTyping');
    };
  }, [socket, activeChat]);

  // Handle room messages
  useEffect(() => {
    if (!socket) return;

    socket.on('newRoomMessage', (msg) => {
      if (activeChat?.type === 'room' && activeChat.roomId === msg.roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('roomUsersTyping', (users) => {
      if (activeChat?.type === 'room') {
        setTypingUsers(users);
      }
    });

    return () => {
      socket.off('newRoomMessage');
      socket.off('roomUsersTyping');
    };
  }, [socket, activeChat]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket) return;

    if (activeChat === 'global') {
      socket.emit('globalMessage', { content: message });
    } else if (activeChat?.type === 'private') {
      socket.emit('privateMessage', { receiverId: activeChat.userId, content: message });
    } else if (activeChat?.type === 'room') {
      socket.emit('roomMessage', { roomId: activeChat.roomId, content: message });
    }

    setMessage('');
    setIsTyping(false);

    if (socket) {
      if (activeChat === 'global') {
        socket.emit('globalStopTyping');
      } else if (activeChat?.type === 'private') {
        socket.emit('privateStopTyping', { receiverId: activeChat.userId });
      } else if (activeChat?.type === 'room') {
        socket.emit('roomStopTyping', { roomId: activeChat.roomId });
      }
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTyping && socket) {
      setIsTyping(true);
      if (activeChat === 'global') {
        socket.emit('globalTyping');
      } else if (activeChat?.type === 'private') {
        socket.emit('privateTyping', { receiverId: activeChat.userId });
      } else if (activeChat?.type === 'room') {
        socket.emit('roomTyping', { roomId: activeChat.roomId });
      }
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        if (activeChat === 'global') {
          socket.emit('globalStopTyping');
        } else if (activeChat?.type === 'private') {
          socket.emit('privateStopTyping', { receiverId: activeChat.userId });
        } else if (activeChat?.type === 'room') {
          socket.emit('roomStopTyping', { roomId: activeChat.roomId });
        }
      }
    }, 2000);
  };

const handleUserClick = async (userId, username) => {

  setUnreadMessages((prev) => ({
    ...prev,
    [userId]: 0
  }));

  setActiveChat({ type: 'private', userId });

  setShowUserList(false);
  setSearchTerm('');

  await fetchChatHistory('private', userId);

  if (socket) {
    socket.emit('joinPrivateChat', { userId });
  }
};

  // const handleRoomClick = async (roomId) => {
  //   setActiveChat({ type: 'room', roomId });
  //   setMessages([]);
  //   await fetchChatHistory('room', roomId);
  //   if (socket) {
  //     socket.emit('joinRoom', { roomId });
  //   }
  // };

  // const handleGlobalChat = () => {
  //   setActiveChat('global');
  //   setMessages([]);
  //   setShowUserList(false);
  //   setSearchTerm('');
  // };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await messageService.uploadFile(formData);
      const { url, messageType } = response.data;

      if (activeChat === 'global') {
        socket.emit('globalMessage', { content: url, messageType });
      } else if (activeChat?.type === 'private') {
        socket.emit('privateMessage', { receiverId: activeChat.userId, content: url, messageType });
      } else if (activeChat?.type === 'room') {
        socket.emit('roomMessage', { roomId: activeChat.roomId, content: url, messageType });
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true);
  };

  const handleViewProfile = () => {
    setSelectedProfileUserId(user?.id);
    setShowProfileModal(true);
    setShowDropdown(false);
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    onLogout();
  };

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const getUserAvatar = (userId, username) => {
    if (userAvatars[userId]) {
      return userAvatars[userId];
    }
    return null;
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">Chat App</div>
          <div className="header-actions" ref={dropdownRef}>
            <button 
              className="more-options-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              title="More options"
            >
              <FiMoreVertical />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleViewProfile}>
                  <FiUser /> Profile
                </button>
                <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* <div 
          className="user-info"
          onClick={handleViewProfile}
          style={{ cursor: 'pointer' }}
          title="Click to view your profile"
        >
          <div className="user-avatar">
            {getUserAvatar(user?.id, user?.username) ? (
              <img 
                src={getUserAvatar(user?.id, user?.username)} 
                alt={user?.username}
                className="avatar-img"
              />
            ) : (
              user?.username[0]?.toUpperCase()
            )}
          </div>
          <div className="user-details">
            <p className="username">{user?.username}</p>
            <p className="user-status online">● Online</p>
          </div>
        </div> */}

        {/* <button
          className={`chat-option ${activeChat === 'global' ? 'active' : ''}`}
          onClick={handleGlobalChat}
        >
          <FiUsers /> Global Chat
        </button> */}

        <div className="sidebar-section">
          <div className="section-header-with-search">
            <h3>Recent Chats</h3>
            <div className="chats-search">
              <FiSearch className="search-icon-small" />
              <input
                type="text"
                placeholder="Search chats..."
                value={chatSearchTerm}
                onChange={(e) => setChatSearchTerm(e.target.value)}
                className="chats-search-input"
              />
              {chatSearchTerm && (
                <FiX className="clear-search-small" onClick={() => setChatSearchTerm('')} />
              )}
            </div>
          </div>
          <div className="recent-chats">
            {filteredRecentChats.slice(0, 10).map((chat, idx) => (
              <div
                key={idx}
                className={`chat-item ${activeChat?.type === 'private' && activeChat.userId === chat._id ? 'active' : ''}`}
                onClick={() => handleUserClick(chat._id, 'User')}
              >
                <div className="chat-item-avatar">
                  {getUserAvatar(chat._id, chat.userDetails?.[0]?.username) ? (
                    <img 
                      src={getUserAvatar(chat._id, chat.userDetails?.[0]?.username)} 
                      alt={chat.userDetails?.[0]?.username}
                      className="avatar-img-small"
                    />
                  ) : (
                    chat.userDetails?.[0]?.username[0]?.toUpperCase() || '?'
                  )}
                </div>
<div className="chat-item-info">

  <div className="chat-item-top">

    <p className="chat-item-name">
      {chat.userDetails?.[0]?.username || 'Unknown'}
    </p>

    {unreadMessages[chat._id] > 0 && (
      <div className="unread-badge">
        {unreadMessages[chat._id]}
      </div>
    )}

  </div>

</div>

  {/* <p className="chat-item-message">
    {chat.lastMessage?.substring(0, 30)}
  </p> */}

              </div>
            ))}
            {filteredRecentChats.length === 0 && (
              <div className="no-chats-found">
                <p>No chats found</p>
              </div>
            )}
          </div>
        </div>

        <button
          className="show-users-btn"
          onClick={() => setShowUserList(!showUserList)}
        >
          {showUserList ? '✕ Close Users' : '+ Add Chat'}
        </button>

        {showUserList && (
          <div className="users-list-container">
            <div className="users-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="users-search-input"
              />
              {searchTerm && (
                <FiX className="clear-search" onClick={() => setSearchTerm('')} />
              )}
            </div>
            <div className="users-list">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className="user-item"
                    onClick={() => handleUserClick(u._id, u.username)}
                  >
                    <div className="user-avatar-small">
                      {getUserAvatar(u._id, u.username) ? (
                        <img 
                          src={getUserAvatar(u._id, u.username)} 
                          alt={u.username}
                          className="avatar-img-small"
                        />
                      ) : (
                        <div className="avatar-placeholder-small">
                          {u.username[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className={`status-indicator ${isUserOnline(u._id) ? 'online' : 'offline'}`}></div>
                    </div>
                    <div className="user-info-details">
                      <span className="user-name">{u.username}</span>
                      {u.email && <span className="user-email">{u.email}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-users-found">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                {activeChat?.type === 'private' && (
                  <div 
                    className="chat-user-avatar"
                    onClick={() => {
                      setSelectedProfileUserId(activeChat.userId);
                      setShowProfileModal(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {getUserAvatar(activeChat.userId, users.find(u => u._id === activeChat.userId)?.username) ? (
                      <img 
                        src={getUserAvatar(activeChat.userId, users.find(u => u._id === activeChat.userId)?.username)} 
                        alt={users.find(u => u._id === activeChat.userId)?.username}
                        className="avatar-img-medium"
                      />
                    ) : (
                      <div className="avatar-placeholder-medium">
                        {users.find(u => u._id === activeChat.userId)?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className={`online-indicator ${isUserOnline(activeChat.userId) ? 'online' : 'offline'}`}></div>
                  </div>
                )}
                <h2>
                  {activeChat === 'global'
                    ? 'Global Chat'
                    : activeChat.type === 'private'
                      ? users.find(u => u._id === activeChat.userId)?.username
                      : 'Group Chat'}
                </h2>
              </div>
              {activeChat?.type === 'private' && (
                <button 
                  className="view-profile-btn"
                  onClick={() => {
                    setSelectedProfileUserId(activeChat.userId);
                    setShowProfileModal(true);
                  }}
                  title="View user profile"
                >
                  <FiUser size={20} /> View Profile
                </button>
              )}
            </div>

            <div className="messages">
              {messages.map((msg, idx) => {
                const prevMsg = messages[idx - 1];

const currentSenderId = msg.senderId?._id || msg.senderId;

const prevSenderId =
  prevMsg?.senderId?._id || prevMsg?.senderId;

const showSenderInfo =
  idx === 0 || currentSenderId !== prevSenderId;
                const isSent = msg.senderId === user?.id || msg.senderId?._id === user?.id || (typeof msg.senderId === 'string' && msg.senderId === user?.id);
                const senderUser = users.find(u => u._id === (msg.senderId?._id || msg.senderId));
                
                return (
                  <div
                    key={idx}
                    className={`message ${isSent ? 'sent' : 'received'} ${
  !showSenderInfo ? 'same-user' : ''
}`}
                  >
                    {!isSent && false && (
                      <div 
                        className="message-avatar"
                        onClick={() => {
                          setSelectedProfileUserId(senderUser?._id);
                          setShowProfileModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {getUserAvatar(senderUser?._id, senderUser?.username) ? (
                          <img 
                            src={getUserAvatar(senderUser?._id, senderUser?.username)} 
                            alt={senderUser?.username}
                            className="avatar-img-small"
                          />
                        ) : (
                          <div className="avatar-placeholder-small">
                            {senderUser?.username?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="message-content">
                      {/* {showSenderInfo && (
  <p className="message-sender">
    {msg.senderId?.username || (typeof msg.senderId === 'string' ? 'You' : msg.senderId)}
  </p>
)} */}
                        
                      {msg.messageType === 'image' ? (
                        <img 
                          src={`https://chat-backend-da9m.onrender.com/${msg.content}`} 
                          alt="uploaded" 
                          className="message-image"
                          onClick={() => handleImageClick(`https://chat-backend-da9m.onrender.com/${msg.content}`)}
                        />
                      ) : msg.messageType === 'file' ? (
                        <a 
                          href={`https://chat-backend-da9m.onrender.com/${msg.content}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="message-file-link"
                        >
                          <FiFile style={{ marginRight: '5px' }} /> Download File
                        </a>
                      ) : (
                        <p className="message-text">{msg.content}</p>
                      )}
                      <p className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {typingUsers.length > 0 && (
                <div className="typing-indicator">
                  <p>{typingUsers.map(u => u.username).join(', ')} is typing</p>
                  <div className="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-area">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button onClick={() => fileInputRef.current?.click()} className="attach-btn" title="Attach file">
                <FiPaperclip />
              </button>
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-btn">
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
            <Profile 
              userId={selectedProfileUserId} 
              isModal={true} 
              onClose={() => setShowProfileModal(false)}
            />
          </div>
        </div>
      )}

      {/* Image Popup Modal */}
      {showImagePopup && selectedImage && (
        <div className="image-popup-overlay" onClick={() => setShowImagePopup(false)}>
          <div className="image-popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="image-popup-close" onClick={() => setShowImagePopup(false)}>
              <FiX />
            </button>
            <img src={selectedImage} alt="Full size" className="image-popup-img" />
          </div>
        </div>
      )}
    </div>
  );
};