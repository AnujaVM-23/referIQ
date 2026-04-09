// server/routes/auth.routes.js
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.post('/verify-email', authMiddleware, authController.verifyEmail);

module.exports = router;
