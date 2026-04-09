// server/services/matching.service.js - AI candidate-referrer scoring
const CandidateProfile = require('../models/CandidateProfile');
const ReferrerProfile = require('../models/ReferrerProfile');

const normalizeTerms = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
};

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

const findTopMatches = async (candidateId, options = {}) => {
  try {
    const { limit = 10, company = '', skills = '' } = options;
    const candidate = await CandidateProfile.findOne({ userId: candidateId });
    if (!candidate) return [];

    const requestedCompany = String(company).trim();
    const requestedSkills = normalizeTerms(skills);

    const referrerQuery = { isAvailable: true };
    if (requestedCompany) {
      referrerQuery.company = { $regex: requestedCompany, $options: 'i' };
    }

    const referrers = await ReferrerProfile.find(referrerQuery).limit(100);

    const candidateSkills = normalizeTerms(candidate.skills);
    const candidateTargetCompanies = normalizeTerms(candidate.targetCompanies);
    const candidateTargetRoles = normalizeTerms(candidate.targetRoles);
    
    const matches = referrers
      .map(referrer => ({
        ...referrer.toObject(),
        matchScore: calculateMatchScore(candidate, referrer),
        matchedSkills: candidateSkills.filter((skill) =>
          String(referrer.role || '').toLowerCase().includes(skill)
        ),
        matchedTargetCompany: candidateTargetCompanies.some((c) =>
          String(referrer.company || '').toLowerCase().includes(c)
        ),
        matchedTargetRole: candidateTargetRoles.some((r) =>
          String(referrer.role || '').toLowerCase().includes(r)
        ),
      }))
      .filter((referrer) => {
        if (requestedSkills.length === 0) return true;
        const role = String(referrer.role || '').toLowerCase();
        return requestedSkills.some((skill) => role.includes(skill));
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit, 10));

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
