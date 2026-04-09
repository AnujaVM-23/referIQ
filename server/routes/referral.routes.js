// server/routes/referral.routes.js
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const referralController = require('../controllers/referral.controller');

const router = express.Router();

router.post('/', authMiddleware, referralController.createReferralRequest);
router.get('/:id', authMiddleware, referralController.getReferralById);
router.patch('/:id/status', authMiddleware, referralController.updateReferralStatus);
router.get('/my/sent', authMiddleware, referralController.getSentReferrals);
router.get('/my/received', authMiddleware, referralController.getReceivedReferrals);
router.post('/:id/report', authMiddleware, referralController.reportReferral);

module.exports = router;
