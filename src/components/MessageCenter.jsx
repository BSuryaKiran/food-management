import React, { useState } from 'react';
import './MessageCenter.css';

const MessageCenter = ({ messages, onMarkAsRead, onDeleteMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const unreadCount = messages.filter(m => !m.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      onMarkAsRead(message.id);
    }
  };

  const handleBack = () => {
    setSelectedMessage(null);
  };

  const handleDelete = (id) => {
    onDeleteMessage(id);
    setSelectedMessage(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderAvatar = (sender) => {
    const avatars = {
      'System': '🤖',
      'Admin': '👨‍💼',
      'Support': '💁',
      'Donor': '🍽️',
      'Seeker': '🤝'
    };
    return avatars[sender] || '👤';
  };

  return (
    <div className="message-center-container">
      <button 
        className="message-center-btn" 
        onClick={handleToggle}
        aria-label="Messages"
      >
        <span className="message-icon">💬</span>
        {unreadCount > 0 && (
          <span className="message-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="message-overlay" onClick={() => setIsOpen(false)} />
          <div className="message-dropdown">
            {!selectedMessage ? (
              <>
                <div className="message-header">
                  <h3>Messages</h3>
                  <button 
                    className="close-btn" 
                    onClick={() => setIsOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="message-list">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <span className="no-msg-icon">📭</span>
                      <p>No messages</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`message-item ${!message.read ? 'unread' : ''}`}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <span className="sender-avatar">
                          {getSenderAvatar(message.sender)}
                        </span>
                        <div className="msg-preview">
                          <div className="msg-header-row">
                            <span className="msg-sender">{message.sender}</span>
                            <span className="msg-time">{formatTime(message.timestamp)}</span>
                          </div>
                          <p className="msg-subject">{message.subject}</p>
                          <p className="msg-preview-text">{message.preview}</p>
                        </div>
                        {!message.read && <span className="unread-indicator"></span>}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="message-header">
                  <button className="back-btn" onClick={handleBack}>
                    ← Back
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    🗑️
                  </button>
                </div>

                <div className="message-detail">
                  <div className="message-detail-header">
                    <div className="sender-info">
                      <span className="sender-avatar-large">
                        {getSenderAvatar(selectedMessage.sender)}
                      </span>
                      <div>
                        <h4>{selectedMessage.sender}</h4>
                        <span className="detail-time">
                          {formatTime(selectedMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="message-subject">{selectedMessage.subject}</h3>
                  
                  <div className="message-body">
                    {selectedMessage.body}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageCenter;
