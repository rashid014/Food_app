const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

// Route for sending OTP to the user's email
router.post('/forgot-password', forgotPasswordController.sendOTP);

// Route for resetting the password
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;
