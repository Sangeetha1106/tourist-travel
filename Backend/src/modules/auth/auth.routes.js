const express = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
