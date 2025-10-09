import React, { useState } from 'react';
import './NotificationBell.css';

const NotificationBell = ({ notifications, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id) => {
    onMarkAsRead(id);
  };

  const handleClearAll = () => {
    onClearAll();
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      message: '💬'
    };
    return icons[type] || '🔔';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="notification-bell-container">
      <button 
        className="notification-bell-btn" 
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              {notifications.length > 0 && (
                <button 
                  className="clear-all-btn" 
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <span className="no-notif-icon">🔕</span>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <span className="notif-icon">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="notif-content">
                      <p className="notif-title">{notification.title}</p>
                      <p className="notif-message">{notification.message}</p>
                      <span className="notif-time">{formatTime(notification.timestamp)}</span>
                    </div>
                    {!notification.read && <span className="unread-dot"></span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
