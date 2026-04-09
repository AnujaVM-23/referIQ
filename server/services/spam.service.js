// server/services/spam.service.js - Anti-spam + rate limit checks
const ReferralRequest = require('../models/ReferralRequest');
const CandidateProfile = require('../models/CandidateProfile');
const Report = require('../models/Report');

const SPAM_KEYWORDS = ['casino', 'bitcoin', 'lottery', 'money', 'free money', 'forex'];
const MIN_MESSAGE_LENGTH = 50;
const REQUEST_LIMIT_PER_DAY = 5;
const LOW_QUALITY_LIMIT = 2;
const COOLDOWN_PERIOD = 30 * 24 * 60 * 60 * 1000; // 30 days

const isSpamMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

const checkRateLimitAsync = async (candidateId) => {
  try {
    const candidate = await CandidateProfile.findOne({ userId: candidateId });
    if (!candidate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (candidate.lastRequestReset < today) {
      candidate.requestsSentToday = 0;
      candidate.lastRequestReset = today;
      await candidate.save();
    }

    const limit = candidate.qualityScore < 40 ? LOW_QUALITY_LIMIT : REQUEST_LIMIT_PER_DAY;
    
    return candidate.requestsSentToday < limit;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow if error
  }
};

const canRequestReferrer = async (candidateId, referrerId) => {
  try {
    const recentRequest = await ReferralRequest.findOne({
      candidateId,
      referrerId,
      createdAt: {
        $gte: new Date(Date.now() - COOLDOWN_PERIOD),
      },
    });

    return !recentRequest;
  } catch (error) {
    console.error('Error checking referrer request history:', error);
    return true; // Allow if error
  }
};

const validateIntroMessage = (message) => {
  if (!message || message.length < MIN_MESSAGE_LENGTH) {
    return false;
  }
  if (isSpamMessage(message)) {
    return false;
  }
  return true;
};

const incrementRequestCount = async (candidateId) => {
  try {
    await CandidateProfile.findOneAndUpdate(
      { userId: candidateId },
      { $inc: { requestsSentToday: 1 } }
    );
  } catch (error) {
    console.error('Error incrementing request count:', error);
  }
};

const checkConsecutiveDeclines = async (candidateId) => {
  try {
    const recentDeclines = await ReferralRequest.countDocuments({
      candidateId,
      status: 'declined',
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    });

    return recentDeclines >= 5;
  } catch (error) {
    console.error('Error checking consecutive declines:', error);
    return false;
  }
};

module.exports = {
  isSpamMessage,
  checkRateLimitAsync,
  canRequestReferrer,
  validateIntroMessage,
  incrementRequestCount,
  checkConsecutiveDeclines,
};
