import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, ...notification };

    setNotifications((prev) => [...prev, newNotification]);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showSuccess = useCallback(
    (message, title = "نجح") => {
      return addNotification({ type: "success", title, message });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, title = "خطأ") => {
      return addNotification({ type: "error", title, message });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, title = "تحذير") => {
      return addNotification({ type: "warning", title, message });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, title = "معلومات") => {
      return addNotification({ type: "info", title, message });
    },
    [addNotification]
  );

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Render notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
