// server/services/matching.service.js - AI candidate-referrer scoring
const CandidateProfile = require('../models/CandidateProfile');
const ReferrerProfile = require('../models/ReferrerProfile');

const calculateMatchScore = (candidate, referrer) => {
  let score = 0;

  // Check skill overlap
  const candidateSkills = candidate.skills ? candidate.skills.map(s => s.toLowerCase()) : [];
  const referrerRole = referrer.role ? referrer.role.toLowerCase() : '';
  
  candidateSkills.forEach(skill => {
    if (referrerRole.includes(skill) || skill.includes(referrerRole)) {
      score += 15;
    }
  });

  // Check target company match
  const targetCompanies = candidate.targetCompanies ? candidate.targetCompanies.map(c => c.toLowerCase()) : [];
  const referrerCompany = referrer.company ? referrer.company.toLowerCase() : '';
  
  if (targetCompanies.some(c => referrerCompany.includes(c))) {
    score += 25;
  }

  // Check target role match
  const targetRoles = candidate.targetRoles ? candidate.targetRoles.map(r => r.toLowerCase()) : [];
  
  if (targetRoles.some(r => referrerRole.includes(r))) {
    score += 20;
  }

  // Factor in referrer's tier
  const tierBonus = {
    platinum: 10,
    gold: 7,
    silver: 4,
    bronze: 0,
  };
  score += tierBonus[referrer.tier] || 0;

  // Factor in quality and trust scores
  score += (candidate.qualityScore / 10);
  score += (referrer.responseRate / 10);

  return Math.min(Math.round(score), 100);
};

const findTopMatches = async (candidateId, limit = 10) => {
  try {
    const candidate = await CandidateProfile.findOne({ userId: candidateId });
    if (!candidate) return [];

    const referrers = await ReferrerProfile.find({ isAvailable: true }).limit(100);
    
    const matches = referrers
      .map(referrer => ({
        ...referrer.toObject(),
        matchScore: calculateMatchScore(candidate, referrer),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

module.exports = {
  calculateMatchScore,
  findTopMatches,
};
