// server/controllers/match.controller.js
const ReferrerProfile = require('../models/ReferrerProfile');
const CandidateProfile = require('../models/CandidateProfile');
const { findTopMatches, calculateMatchScore } = require('../services/matching.service');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const splitTerms = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const getMatchingReferrers = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { limit = 10, company = '', skills = '' } = req.query;

    const matches = await findTopMatches(candidateId, {
      limit: parseInt(limit, 10),
      company,
      skills,
    });

    res.json({
      matches,
      count: matches.length,
    });
  } catch (error) {
    console.error('Get matching referrers error:', error);
    res.status(500).json({ error: 'Failed to get matching referrers' });
  }
};

const getMatchingCandidates = async (req, res) => {
  try {
    const referrerId = req.user.id;
    const { limit = 10, skills = '' } = req.query;

    const referrerProfile = await ReferrerProfile.findOne({ userId: referrerId });
    if (!referrerProfile) {
      return res.status(404).json({ error: 'Referrer profile not found' });
    }

    const skillTerms = splitTerms(skills);

    const query = {
      $or: [
        { targetCompanies: { $in: [referrerProfile.company] } },
        { targetRoles: { $regex: referrerProfile.role, $options: 'i' } },
      ],
    };

    if (skillTerms.length > 0) {
      query.skills = {
        $in: skillTerms.map((skill) => new RegExp(`^${escapeRegex(skill)}$`, 'i')),
      };
    }

    const candidates = await CandidateProfile.find(query).limit(parseInt(limit, 10));

    const matches = candidates.map(candidate => ({
      ...candidate.toObject(),
      matchScore: calculateMatchScore(candidate, referrerProfile),
      matchedSkills: skillTerms.length > 0
        ? (candidate.skills || []).filter((skill) =>
            skillTerms.some((term) => term.toLowerCase() === String(skill).toLowerCase())
          )
        : [],
    })).sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      matches,
      count: matches.length,
    });
  } catch (error) {
    console.error('Get matching candidates error:', error);
    res.status(500).json({ error: 'Failed to get matching candidates' });
  }
};

const scoreMatch = async (req, res) => {
  try {
    const { candidateId, referrerId } = req.body;

    const candidate = await CandidateProfile.findOne({ userId: candidateId });
    const referrer = await ReferrerProfile.findOne({ userId: referrerId });

    if (!candidate || !referrer) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const score = calculateMatchScore(candidate, referrer);

    res.json({
      score,
      candidate: candidateId,
      referrer: referrerId,
    });
  } catch (error) {
    console.error('Score match error:', error);
    res.status(500).json({ error: 'Failed to score match' });
  }
};

module.exports = {
  getMatchingReferrers,
  getMatchingCandidates,
  scoreMatch,
};
