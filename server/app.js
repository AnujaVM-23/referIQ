// server/app.js - Express app, middleware, all routes
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const referralRoutes = require('./routes/referral.routes');
const matchRoutes = require('./routes/match.routes');
const scoreRoutes = require('./routes/score.routes');

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RefLink server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/scores', scoreRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

module.exports = app;
