// otpModel.js

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Automatically delete the OTP document after 5 minutes
  },
});

const OtpPhone = mongoose.model('OtpPhone', otpSchema);

module.exports = OtpPhone;
