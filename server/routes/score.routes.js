// server/routes/score.routes.js
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const scoreController = require('../controllers/score.controller');

const router = express.Router();

router.get('/:userId', scoreController.getScore);
router.get('/leaderboard', scoreController.getLeaderboard);
router.post('/event', authMiddleware, scoreController.recordScoreEvent);

module.exports = router;
