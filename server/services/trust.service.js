// server/services/trust.service.js - Trust score engine
const TrustScore = require('../models/TrustScore');
const User = require('../models/User');

const trustEvents = {
  EMAIL_VERIFIED: 20,
  LINKEDIN_CONNECTED: 25,
  WORK_EMAIL_VERIFIED: 15,
  SUCCESSFUL_REFERRAL: 10,
  FLAGGED_BY_USER: -30,
};

const createTrustScore = async (userId) => {
  try {
    const trustScore = new TrustScore({
      userId,
      totalScore: 0,
      components: {
        emailVerified: 0,
        linkedinConnected: 0,
        referralHistory: 0,
        peerFeedback: 0,
        accountAge: 0,
      },
    });
    await trustScore.save();
    return trustScore;
  } catch (error) {
    console.error('Error creating trust score:', error);
    throw error;
  }
};

const updateTrustScore = async (userId, eventType, delta = null) => {
  try {
    const score = await TrustScore.findOne({ userId });
    if (!score) {
      await createTrustScore(userId);
      return updateTrustScore(userId, eventType, delta);
    }

    const value = delta !== null ? delta : (trustEvents[eventType] || 0);
    score.totalScore += value;
    score.totalScore = Math.max(0, score.totalScore); // Can't go below 0

    score.events.push({
      type: eventType,
      delta: value,
      timestamp: new Date(),
    });

    await score.save();

    // Update user's trustScore field
    await User.findByIdAndUpdate(userId, { trustScore: score.totalScore });

    return score;
  } catch (error) {
    console.error('Error updating trust score:', error);
    throw error;
  }
};

const getTrustScore = async (userId) => {
  try {
    let score = await TrustScore.findOne({ userId });
    if (!score) {
      score = await createTrustScore(userId);
    }
    return score;
  } catch (error) {
    console.error('Error getting trust score:', error);
    throw error;
  }
};

module.exports = {
  trustEvents,
  createTrustScore,
  updateTrustScore,
  getTrustScore,
};
