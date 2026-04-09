// server/models/ReferralRequest.js
const mongoose = require('mongoose');

const referralRequestSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobUrl: String,
  introMessage: {
    type: String,
    required: true,
    minlength: 50,
  },
  resumeUrl: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'referred', 'interviewing', 'hired', 'closed'],
    default: 'pending',
  },
  statusHistory: [{
    from: String,
    to: String,
    changedBy: String, // 'candidate' or 'referrer'
    note: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  revealConsent: {
    candidateConsented: {
      type: Boolean,
      default: false,
    },
    referrerConsented: {
      type: Boolean,
      default: false,
    },
    revealedAt: Date,
  },
  isSpam: {
    type: Boolean,
    default: false,
  },
  flaggedBy: [mongoose.Schema.Types.ObjectId],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('ReferralRequest', referralRequestSchema);
