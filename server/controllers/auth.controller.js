// server/controllers/auth.controller.js
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const ReferrerProfile = require('../models/ReferrerProfile');
const TrustScore = require('../models/TrustScore');
const { generateAlias } = require('../utils/generateAlias');
const { createTrustScore } = require('../services/trust.service');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    if (!['candidate', 'referrer', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const alias = generateAlias();
    const user = new User({
      email,
      passwordHash: password,
      role,
      alias,
      isAnonymous: true,
    });

    await user.save();

    // Create trust score
    await createTrustScore(user._id);

    // Create role-specific profile
    if (role === 'candidate') {
      const candidateProfile = new CandidateProfile({
        userId: user._id,
        fullName: '',
        skills: [],
        targetRoles: [],
        targetCompanies: [],
      });
      await candidateProfile.save();
    } else if (role === 'referrer') {
      const referrerProfile = new ReferrerProfile({
        userId: user._id,
        fullName: '',
        company: '',
        maskedCompany: '',
        role: '',
      });
      await referrerProfile.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been suspended' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = async (req, res) => {
  // JWT-based logout is handled client-side by discarding the token
  res.json({ message: 'Logout successful' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = user.role === 'candidate'
      ? await CandidateProfile.findOne({ userId: user._id })
      : await ReferrerProfile.findOne({ userId: user._id });

    res.json({
      user: user.toJSON(),
      profile,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    // In production, verify code from email
    // For now, just mark as verified
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        isVerified: true,
        verificationMethod: 'email',
      },
      { new: true }
    );

    res.json({
      message: 'Email verified successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
};
