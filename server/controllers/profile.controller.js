// server/controllers/profile.controller.js
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const ReferrerProfile = require('../models/ReferrerProfile');
const { maskCandidateProfile, maskReferrerProfile } = require('../middleware/privacy.middleware');
const { calculateQualityScore } = require('../utils/scoreEngine');

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profile;
    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ userId: id });
    } else if (user.role === 'referrer') {
      profile = await ReferrerProfile.findOne({ userId: id });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const isOwner = req.user && req.user.id === id;
    
    if (user.role === 'candidate') {
      const maskedProfile = maskCandidateProfile(profile, isOwner);
      res.json({ user: user.toJSON(), profile: maskedProfile });
    } else if (user.role === 'referrer') {
      const maskedProfile = maskReferrerProfile(profile, isOwner);
      res.json({ user: user.toJSON(), profile: maskedProfile });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (String(req.user.id) !== String(id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let profile;
    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOneAndUpdate(
        { userId: id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!profile) {
        return res.status(404).json({ error: 'Candidate profile not found' });
      }
      profile.qualityScore = calculateQualityScore(profile);
      await profile.save();
    } else if (user.role === 'referrer') {
      profile = await ReferrerProfile.findOneAndUpdate(
        { userId: id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!profile) {
        return res.status(404).json({ error: 'Referrer profile not found' });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported role for profile update' });
    }

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const searchProfiles = async (req, res) => {
  try {
    const { role = 'referrer', company, skills, page = 1, limit = 20 } = req.query;

    let query = {};

    if (role === 'referrer' && company) {
      query.company = { $regex: company, $options: 'i' };
    }

    if (role === 'candidate' && skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillArray };
    }

    const Model = role === 'candidate' ? CandidateProfile : ReferrerProfile;
    const skip = (page - 1) * limit;

    const profiles = await Model.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Model.countDocuments(query);

    res.json({
      profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({ error: 'Failed to search profiles' });
  }
};

const revealProfile = async (req, res) => {
  try {
    const { referralId } = req.body;
    const userId = req.user.id;

    // Check if user has consent from other party
    const ReferralRequest = require('../models/ReferralRequest');
    const referral = await ReferralRequest.findById(referralId);

    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    const isCandidateRequester = referral.candidateId.toString() === userId;
    const isReferrerRequester = referral.referrerId.toString() === userId;

    if (!isCandidateRequester && !isReferrerRequester) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (isCandidateRequester) {
      referral.revealConsent.candidateConsented = true;
    } else {
      referral.revealConsent.referrerConsented = true;
    }

    if (referral.revealConsent.candidateConsented && referral.revealConsent.referrerConsented) {
      referral.revealConsent.revealedAt = new Date();
    }

    await referral.save();

    res.json({
      message: 'Reveal consent updated',
      referral,
    });
  } catch (error) {
    console.error('Reveal profile error:', error);
    res.status(500).json({ error: 'Failed to reveal profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  searchProfiles,
  revealProfile,
};
