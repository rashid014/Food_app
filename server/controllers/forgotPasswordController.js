const nodemailer = require('nodemailer'); // for sending email
const crypto = require('crypto'); // for generating OTP
const User = require('../model/userMode'); // your user model
const OTP = require('../model/Otp');
require('dotenv').config();
console.log(process.env.PASSWORD);

const bcrypt = require('bcrypt');



// Create a nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'Gmail', 'Outlook'
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set an expiration time for the OTP (e.g., 10 minutes from now)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 minutes

    // Create an OTP document and save it
    const otpDoc = new OTP({
      email,
      otp,
      
    });

    await otpDoc.save();

    // Send the OTP to the user's email
    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
console.log("rb"+JSON.stringify(req.body))
  try {
    // Find the OTP document by email
    const otpDoc = await OTP.findOne({ email });
    console.log("otpdoc "+JSON.stringify(otpDoc))
    if (!otpDoc) {
      return res.status(404).json({ success: false, message: 'OTP not found.' });
    }

    console.log(typeof otpDoc.otp,"otpDoc", typeof otp,"otp")
// console.log("otp "+ otpDoc.otp)
    // Check if the OTP is valid and hasn't expired
    // parseint(otp)
    if (otpDoc.otp != otp ) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the hashed passzword
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    // Delete the OTP document
    await otpDoc.remove();

    res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};