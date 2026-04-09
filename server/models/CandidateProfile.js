// server/models/CandidateProfile.js
const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
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
  headline: String,
  bio: String,
  location: String,
  skills: [String],
  experience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
  }],
  targetRoles: [String],
  targetCompanies: [String],
  resumeUrl: String,
  profilePhoto: String,
  linkedinUrl: String,
  qualityScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  requestsSentToday: {
    type: Number,
    default: 0,
  },
  lastRequestReset: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
