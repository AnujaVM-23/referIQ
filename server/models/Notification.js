// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['request_received', 'request_accepted', 'request_declined', 'status_update', 'reveal_request', 'new_match'],
    required: true,
  },
  message: String,
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferralRequest',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
