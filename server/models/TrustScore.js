// server/models/TrustScore.js
const mongoose = require('mongoose');

const trustScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  components: {
    emailVerified: {
      type: Number,
      default: 0,
    },
    linkedinConnected: {
      type: Number,
      default: 0,
    },
    referralHistory: {
      type: Number,
      default: 0,
    },
    peerFeedback: {
      type: Number,
      default: 0,
    },
    accountAge: {
      type: Number,
      default: 0,
    },
  },
  events: [{
    type: String,
    delta: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('TrustScore', trustScoreSchema);
