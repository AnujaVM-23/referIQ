// server/models/ReferrerProfile.js
const mongoose = require('mongoose');

const referrerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  maskedCompany: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: '',
  },
  department: String,
  location: String,
  referralCapacity: {
    type: Number,
    default: 3,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  responseRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  referralScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  totalReferrals: {
    type: Number,
    default: 0,
  },
  successfulHires: {
    type: Number,
    default: 0,
  },
  profilePhoto: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('ReferrerProfile', referrerProfileSchema);
