// server/routes/match.routes.js
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const matchController = require('../controllers/match.controller');

const router = express.Router();

router.get('/referrers', authMiddleware, matchController.getMatchingReferrers);
router.get('/candidates', authMiddleware, matchController.getMatchingCandidates);
router.post('/score', authMiddleware, matchController.scoreMatch);

module.exports = router;
