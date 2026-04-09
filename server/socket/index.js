// server/socket/index.js - Full Socket.io server with all event handlers
const jwt = require('jsonwebtoken');
require('dotenv').config();

const setupSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.userId} connected to Socket.io`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected`);
    });

    // Join room for real-time notifications
    socket.on('join_notification_room', (data) => {
      socket.join(`notifications_${data.userId}`);
      console.log(`📧 User ${socket.userId} joined notification room`);
    });

    // Handle referral request notification
    socket.on('referral_request_sent', (data) => {
      const { referrerId, jobTitle, company } = data;
      io.to(`user_${referrerId}`).emit('new_referral_request', {
        referrerId,
        jobTitle,
        company,
        timestamp: new Date(),
      });
      console.log(`📨 Referral request notification sent to ${referrerId}`);
    });

    // Handle status update notification
    socket.on('status_update', (data) => {
      const { userId, status, referralId } = data;
      io.to(`user_${userId}`).emit('referral_status_changed', {
        status,
        referralId,
        timestamp: new Date(),
      });
      console.log(`🔄 Status update notification sent to ${userId}`);
    });

    // Handle user online status
    socket.on('user_online', (data) => {
      io.emit('user_status_changed', {
        userId: socket.userId,
        status: 'online',
        timestamp: new Date(),
      });
    });

    // Handle user offline status
    socket.on('user_offline', (data) => {
      io.emit('user_status_changed', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date(),
      });
    });

    // Handle typing indicator
    socket.on('typing_start', (data) => {
      const { recipientId } = data;
      io.to(`user_${recipientId}`).emit('user_typing', {
        userId: socket.userId,
      });
    });

    socket.on('typing_stop', (data) => {
      const { recipientId } = data;
      io.to(`user_${recipientId}`).emit('user_stopped_typing', {
        userId: socket.userId,
      });
    });

    // Handle reveal consent
    socket.on('reveal_consent_updated', (data) => {
      const { referralId, recipientId } = data;
      io.to(`user_${recipientId}`).emit('reveal_consent_changed', {
        referralId,
        timestamp: new Date(),
      });
    });

    // Handle match notifications
    socket.on('new_match_found', (data) => {
      const { userId, matchedUserId, matchScore } = data;
      io.to(`user_${userId}`).emit('potential_match', {
        matchedUserId,
        matchScore,
        timestamp: new Date(),
      });
    });

    // Handle error events
    socket.on('error', (error) => {
      console.error(`🔴 Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

module.exports = setupSocket;
