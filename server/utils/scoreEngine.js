// server/utils/scoreEngine.js - Points + tier calculation
const calculateTier = (score) => {
  if (score >= 600) return 'platinum';
  if (score >= 300) return 'gold';
  if (score >= 100) return 'silver';
  return 'bronze';
};

const scoreEvents = {
  REQUEST_ACCEPTED: 10,
  INTERVIEWING: 30,
  HIRED: 100,
  SPAM_FLAGGED: -20,
};

const calculateQualityScore = (profile) => {
  let score = 50; // Base score
  
  if (profile.skills && profile.skills.length > 0) score += 5 * Math.min(profile.skills.length, 5);
  if (profile.experience && profile.experience.length > 0) score += 5 * Math.min(profile.experience.length, 3);
  if (profile.resumeUrl) score += 10;
  if (profile.linkedinUrl) score += 10;
  
  return Math.min(score, 100);
};

module.exports = {
  calculateTier,
  scoreEvents,
  calculateQualityScore,
};
