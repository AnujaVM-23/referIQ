// server/controllers/referral.controller.js
const ReferralRequest = require('../models/ReferralRequest');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Report = require('../models/Report');
const { canTransition } = require('../utils/statusMachine');
const { validateIntroMessage, checkRateLimitAsync, canRequestReferrer, incrementRequestCount } = require('../services/spam.service');
const { updateTrustScore } = require('../services/trust.service');

const createReferralRequest = async (req, res) => {
  try {
    const { referrerId, jobTitle, company, jobUrl, introMessage, resumeUrl } = req.body;
    const candidateId = req.user.id;
    const io = req.app.get('io');

    // Validate intro message
    if (!validateIntroMessage(introMessage)) {
      return res.status(400).json({ error: 'Intro message must be at least 50 characters and free of spam' });
    }

    // Check rate limit
    const withinLimit = await checkRateLimitAsync(candidateId);
    if (!withinLimit) {
      return res.status(429).json({ error: 'Daily request limit exceeded' });
    }

    // Check if already requested this referrer within 30 days
    const canRequest = await canRequestReferrer(candidateId, referrerId);
    if (!canRequest) {
      return res.status(400).json({ error: 'Cannot request same referrer within 30 days' });
    }

    const referral = new ReferralRequest({
      candidateId,
      referrerId,
      jobTitle,
      company,
      jobUrl,
      introMessage,
      resumeUrl,
      status: 'pending',
      statusHistory: [{
        from: null,
        to: 'pending',
        changedBy: 'system',
        timestamp: new Date(),
      }],
    });

    await referral.save();
    await incrementRequestCount(candidateId);

    // Create notification for referrer
    const notification = new Notification({
      userId: referrerId,
      type: 'request_received',
      message: `You received a new referral request for ${jobTitle} at ${company}`,
      referralId: referral._id,
    });
    await notification.save();

    if (io) {
      io.to(`user_${referrerId}`).emit('new_referral_request', {
        referralId: referral._id.toString(),
        candidateId,
        referrerId,
        jobTitle,
        company,
        status: referral.status,
        timestamp: new Date(),
      });

      // Also notify sender dashboard so their list updates instantly.
      io.to(`user_${candidateId}`).emit('referral_status_changed', {
        referralId: referral._id.toString(),
        status: referral.status,
        timestamp: new Date(),
      });
    }

    res.status(201).json({
      message: 'Referral request created successfully',
      referral,
    });
  } catch (error) {
    console.error('Create referral error:', error);
    res.status(500).json({ error: 'Failed to create referral request' });
  }
};

const getReferralById = async (req, res) => {
  try {
    const { id } = req.params;
    const referral = await ReferralRequest.findById(id)
      .populate('candidateId', 'email alias')
      .populate('referrerId', 'email alias');

    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    res.json(referral);
  } catch (error) {
    console.error('Get referral error:', error);
    res.status(500).json({ error: 'Failed to get referral' });
  }
};

const updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, note } = req.body;
    const userId = req.user.id;
    const io = req.app.get('io');

    const referral = await ReferralRequest.findById(id);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    // Check authorization
    const isCandidate = referral.candidateId.toString() === userId;
    const isReferrer = referral.referrerId.toString() === userId;

    if (!isCandidate && !isReferrer) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate transition
    if (!canTransition(referral.status, newStatus)) {
      return res.status(400).json({ error: `Cannot transition from ${referral.status} to ${newStatus}` });
    }

    // Update status
    const changedBy = isCandidate ? 'candidate' : 'referrer';
    const previousStatus = referral.status;
    referral.status = newStatus;
    referral.statusHistory.push({
      from: previousStatus,
      to: newStatus,
      changedBy,
      note,
      timestamp: new Date(),
    });

    // Award points if hired
    if (newStatus === 'hired') {
      await updateTrustScore(referral.referrerId, 'HIRED', 100);
    }

    await referral.save();

    // Create notification for the other party
    const recipientId = isCandidate ? referral.referrerId : referral.candidateId;
    const notification = new Notification({
      userId: recipientId,
      type: 'status_update',
      message: `Referral status updated to ${newStatus}`,
      referralId: referral._id,
    });
    await notification.save();

    if (io) {
      const statusPayload = {
        referralId: referral._id.toString(),
        status: newStatus,
        changedBy,
        timestamp: new Date(),
      };

      io.to(`user_${referral.candidateId.toString()}`).emit('referral_status_changed', statusPayload);
      io.to(`user_${referral.referrerId.toString()}`).emit('referral_status_changed', statusPayload);
    }

    res.json({
      message: 'Referral status updated successfully',
      referral,
    });
  } catch (error) {
    console.error('Update referral status error:', error);
    res.status(500).json({ error: 'Failed to update referral status' });
  }
};

const getSentReferrals = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    let query = { candidateId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const referrals = await ReferralRequest.find(query)
      .populate('referrerId', 'email alias')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ReferralRequest.countDocuments(query);

    res.json({
      referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get sent referrals error:', error);
    res.status(500).json({ error: 'Failed to get sent referrals' });
  }
};

const getReceivedReferrals = async (req, res) => {
  try {
    const referrerId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    let query = { referrerId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const referrals = await ReferralRequest.find(query)
      .populate('candidateId', 'email alias')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ReferralRequest.countDocuments(query);

    res.json({
      referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get received referrals error:', error);
    res.status(500).json({ error: 'Failed to get received referrals' });
  }
};

const reportReferral = async (req, res) => {
  try {
    const { referralId, reason } = req.body;
    const reporterId = req.user.id;

    const referral = await ReferralRequest.findById(referralId);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    // Add reporter to flaggedBy
    if (!referral.flaggedBy.includes(reporterId)) {
      referral.flaggedBy.push(reporterId);
    }

    // Mark as spam if 3 or more flags
    if (referral.flaggedBy.length >= 3) {
      referral.isSpam = true;
    }

    await referral.save();

    // Create report
    const report = new Report({
      reporterId,
      targetId: referral.candidateId,
      reason,
    });
    await report.save();

    res.json({
      message: 'Referral reported successfully',
      report,
    });
  } catch (error) {
    console.error('Report referral error:', error);
    res.status(500).json({ error: 'Failed to report referral' });
  }
};

module.exports = {
  createReferralRequest,
  getReferralById,
  updateReferralStatus,
  getSentReferrals,
  getReceivedReferrals,
  reportReferral,
};
