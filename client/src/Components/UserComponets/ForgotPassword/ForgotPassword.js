import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance'

import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      // Send a request to your backend to generate and send an OTP to the user's email.
      const response = await axiosInstance.post('/api/forgot-password', { email,otp,newPassword });

      if (response.data.success) {
        setOtpSent(true);
      } else {
        alert('Failed to send OTP. Please check your email address.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again later.');
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      alert('Please enter the OTP and a new password.');
      return;
    }

    try {
      // Send a request to your backend to verify the OTP and reset the password.
      const response = await axiosInstance.post('/api/reset-password', {
        email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        setResetSuccess(true);
      } else {
        alert('Password reset failed. Please check your OTP and try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Password reset failed. Please try again later.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h3 className="forgot-password-title">Forgot Password</h3>
      {resetSuccess ? (
        <div className="success-message">
          Your password has been successfully reset.
        </div>
      ) : otpSent ? (
        <div>
          <p>An OTP has been sent to your email address. Please check your inbox.</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
          <button onClick={handleResetPassword} className="action-button">
            Reset Password
          </button>
        </div>
      ) : (
        <div>
          <p>Enter your email address to receive an OTP for password reset.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button onClick={handleSendOtp} className="action-button">
            Send OTP
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;