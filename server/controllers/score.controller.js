// server/controllers/score.controller.js
const TrustScore = require('../models/TrustScore');
const ReferrerProfile = require('../models/ReferrerProfile');
const User = require('../models/User');
const { calculateTier } = require('../utils/scoreEngine');
const { updateTrustScore, getTrustScore } = require('../services/trust.service');

const getScore = async (req, res) => {
  try {
    const { userId } = req.params;

    const trustScore = await getTrustScore(userId);

    res.json(trustScore);
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({ error: 'Failed to get score' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { company, period = 'all', limit = 100 } = req.query;

    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (period === 'month') {
      dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    let query = {};
    if (company) {
      query.company = company;
    }

    const referrers = await ReferrerProfile.find(query)
      .sort({ referralScore: -1 })
      .limit(parseInt(limit));

    const leaderboard = referrers.map((referrer, index) => ({
      rank: index + 1,
      ...referrer.toObject(),
      tier: calculateTier(referrer.referralScore),
    }));

    res.json({
      leaderboard,
      count: leaderboard.length,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

const recordScoreEvent = async (req, res) => {
  try {
    const { userId, eventType } = req.body;
    const adminId = req.user.id;

    // Verify admin rights (optional - remove if not needed)
    // const admin = await User.findById(adminId);
    // if (admin.role !== 'company') {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    const trustScore = await updateTrustScore(userId, eventType);

    res.json({
      message: 'Score event recorded',
      trustScore,
    });
  } catch (error) {
    console.error('Record score event error:', error);
    res.status(500).json({ error: 'Failed to record score event' });
  }
};

module.exports = {
  getScore,
  getLeaderboard,
  recordScoreEvent,
};
