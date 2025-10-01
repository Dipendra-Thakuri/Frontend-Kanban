import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell } from 'react-icons/fi';
import { KANBAN_API_URL } from './config';

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const BellIcon = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: #333;
  position: relative;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(108, 99, 255, 0.1);
    color: #6c63ff;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  animation: ${props => props.animate ? 'pulse 0.5s ease-in-out' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  transform: ${props => props.open ? 'translateY(0)' : 'translateY(-10px)'};
  opacity: ${props => props.open ? 1 : 0};
  visibility: ${props => props.open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const NotificationHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h4 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }
`;

const DebugInfo = styled.small`
  color: #666;
  font-size: 10px;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  background: ${props => props.read ? 'white' : '#f8f9ff'};
  transition: background 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
`;

const NotificationTime = styled.span`
  color: #999;
`;

const TypeBadge = styled.span`
  background: ${props => {
    switch (props.type) {
      case 'TASK_CREATED': return '#27ae60';
      case 'TASK_UPDATED': return '#f39c12';
      case 'TASK_ASSIGNED': return '#3498db';
      case 'TASK_DELETED': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
`;

const NotificationId = styled.div`
  font-size: 10px;
  color: #ccc;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const MarkAllButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #6c63ff;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5a52d5;
  }
`;

const ErrorMessage = styled.div`
  padding: 16px 20px;
  background: #fee;
  color: #c33;
  font-size: 12px;
  border-bottom: 1px solid #fcc;
`;

const NotificationBell = ({ debug = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Fetch notifications (backend should filter by authenticated user)
  const fetchNotifications = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('No auth token found');
        return;
      }

      // Backend should automatically filter notifications for the authenticated user
      // based on the JWT token in the Authorization header
      const response = await fetch(`${KANBAN_API_URL}/api/v1/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setLastFetch(new Date().toLocaleTimeString());
      
      if (debug) {
        console.log('Raw notifications (user-filtered by backend):', data);
        console.log('Notification types:', data.map(n => n.type));
        console.log('Before dedup:', data.length);
      }

      // Remove duplicates based on ID and sort by creation date (newest first)
      // Backend should already return user-specific notifications
      const uniqueNotifications = data
        .filter((notification, index, self) => 
          index === self.findIndex(n => n.id === notification.id)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (debug) {
        console.log('After dedup and sort:', uniqueNotifications.length);
      }

      const prevCount = unreadCount;
      const newCount = uniqueNotifications.filter(n => !n.read).length;
      
      setNotifications(uniqueNotifications);
      setUnreadCount(newCount);
      
      // Animate if new notifications arrived
      if (newCount > prevCount) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${KANBAN_API_URL}/api/v1/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark as read: ${response.status}`);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError(error.message);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${KANBAN_API_URL}/api/v1/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update succeeded
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        // Fallback to individual updates
        const unreadNotifications = notifications.filter(n => !n.read);
        for (const notification of unreadNotifications) {
          await markAsRead(notification.id);
        }
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Fallback to individual updates
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  // Get notification icon based on type
  const getTypeDisplay = (type) => {
    const typeMap = {
      'TASK_CREATED': 'Created',
      'TASK_UPDATED': 'Updated', 
      'TASK_ASSIGNED': 'Assigned',
      'TASK_DELETED': 'Deleted'
    };
    return typeMap[type] || type;
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 120 seconds
    const interval = setInterval(fetchNotifications, 120000);
    
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.notification-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <NotificationContainer className="notification-container">
      <BellIcon onClick={() => setIsOpen(!isOpen)}>
        <FiBell />
        {unreadCount > 0 && (
          <Badge animate={animate}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </BellIcon>

      <NotificationDropdown open={isOpen}>
        <NotificationHeader>
          <h4>Notifications</h4>
          {debug && (
            <DebugInfo>
              Total: {notifications.length}
              {lastFetch && <div>Last: {lastFetch}</div>}
            </DebugInfo>
          )}
        </NotificationHeader>

        {error && <ErrorMessage>Error: {error}</ErrorMessage>}

        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>No notifications yet</EmptyState>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                read={notification.read}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <NotificationMessage>
                  {notification.message}
                </NotificationMessage>
                <NotificationMeta>
                  <TypeBadge type={notification.type}>
                    {getTypeDisplay(notification.type)}
                  </TypeBadge>
                  <NotificationTime>
                    {formatTime(notification.createdAt)}
                  </NotificationTime>
                </NotificationMeta>
                {debug && (
                  <NotificationId>
                    ID: {notification.id} | Read: {notification.read ? 'Yes' : 'No'}
                  </NotificationId>
                )}
              </NotificationItem>
            ))
          )}
        </NotificationList>

        {unreadCount > 0 && (
          <MarkAllButton onClick={markAllAsRead}>
            Mark All as Read ({unreadCount})
          </MarkAllButton>
        )}
      </NotificationDropdown>
    </NotificationContainer>
  );
};

export default NotificationBell;