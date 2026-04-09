// server/controllers/match.controller.js
const ReferrerProfile = require('../models/ReferrerProfile');
const CandidateProfile = require('../models/CandidateProfile');
const { findTopMatches, calculateMatchScore } = require('../services/matching.service');

const getMatchingReferrers = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { limit = 10 } = req.query;

    const matches = await findTopMatches(candidateId, parseInt(limit));

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
    const { limit = 10 } = req.query;

    const referrerProfile = await ReferrerProfile.findOne({ userId: referrerId });
    if (!referrerProfile) {
      return res.status(404).json({ error: 'Referrer profile not found' });
    }

    const candidates = await CandidateProfile.find({
      $or: [
        { targetCompanies: { $in: [referrerProfile.company] } },
        { targetRoles: { $regex: referrerProfile.role, $options: 'i' } },
      ],
    }).limit(parseInt(limit));

    const matches = candidates.map(candidate => ({
      ...candidate.toObject(),
      matchScore: calculateMatchScore(candidate, referrerProfile),
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
