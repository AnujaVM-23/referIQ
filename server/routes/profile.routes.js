// server/routes/profile.routes.js
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { privacyMiddleware } = require('../middleware/privacy.middleware');
const profileController = require('../controllers/profile.controller');

const router = express.Router();

router.use(privacyMiddleware);

router.get('/:id', profileController.getProfile);
router.put('/:id', authMiddleware, profileController.updateProfile);
router.get('/search', profileController.searchProfiles);
router.post('/reveal', authMiddleware, profileController.revealProfile);

module.exports = router;
