// server/middleware/privacy.middleware.js - Profile masking
const CandidateProfile = require('../models/CandidateProfile');
const ReferrerProfile = require('../models/ReferrerProfile');
const User = require('../models/User');

const maskCandidateProfile = (profile, isOwner = false) => {
  if (isOwner) return profile;

  return {
    userId: profile.userId,
    alias: profile.alias || 'Anonymous Seeker',
    headline: profile.headline,
    skills: profile.skills,
    targetRoles: profile.targetRoles,
    targetCompanies: profile.targetCompanies,
    qualityScore: profile.qualityScore,
  };
};

const maskReferrerProfile = (profile, isOwner = false) => {
  if (isOwner) return profile;

  return {
    userId: profile.userId,
    alias: profile.alias || 'Anonymous Referrer',
    maskedCompany: profile.maskedCompany,
    role: profile.role,
    referralScore: profile.referralScore,
    tier: profile.tier,
    responseRate: profile.responseRate,
  };
};

const privacyMiddleware = async (req, res, next) => {
  res.maskCandidateProfile = maskCandidateProfile;
  res.maskReferrerProfile = maskReferrerProfile;
  next();
};

module.exports = { privacyMiddleware, maskCandidateProfile, maskReferrerProfile };
