// server/routes/referral.routes.js
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const referralController = require('../controllers/referral.controller');

const router = express.Router();

router.post('/', authMiddleware, referralController.createReferralRequest);
router.get('/my/sent', authMiddleware, referralController.getSentReferrals);
router.get('/my/received', authMiddleware, referralController.getReceivedReferrals);
router.get('/referrer/candidate/:candidateId', authMiddleware, referralController.getReferralForReferrerCandidate);
router.get('/company/verification-requests', authMiddleware, referralController.getCompanyVerificationRequests);
router.patch('/company/:id/review', authMiddleware, referralController.reviewReferralByCompany);
router.get('/:id', authMiddleware, referralController.getReferralById);
router.patch('/:id/status', authMiddleware, referralController.updateReferralStatus);
router.post('/:id/report', authMiddleware, referralController.reportReferral);

module.exports = router;
