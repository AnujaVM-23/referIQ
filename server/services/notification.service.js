// server/services/notification.service.js - Socket.io notification emitter
const Notification = require('../models/Notification');

const createNotification = async (userId, type, message, referralId = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      message,
      referralId,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getNotifications = async (userId, limit = 20) => {
  try {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

const markAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const emitToUser = (io, userId, eventName, data) => {
  io.to(`user_${userId}`).emit(eventName, data);
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  emitToUser,
};
