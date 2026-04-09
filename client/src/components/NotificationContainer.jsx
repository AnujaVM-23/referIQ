import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import '../styles/notifications.css';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <p>{notification.message}</p>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
