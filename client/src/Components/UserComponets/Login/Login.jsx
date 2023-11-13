import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import { LoginPost } from '../../../utils/Constants';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../Redux/authSlice';
import './Login.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../utils/axiosInstance'

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP is requested
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false); // Track if OTP verification is in progress
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    if (email === '' || password === '') {
      Swal.fire('Please fill in all the fields', '', 'warning');
      return;
    }

    try {
      let user = await axios.post(LoginPost, JSON.stringify({ email, password }), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (user.data.token) {
        localStorage.setItem('token', user.data.token);
        navigate('/');
        dispatch(loginSuccess({ userId: user.data.user._id }));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid Credentials!',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOTPLogin = async () => {
    if (isVerifyingOTP) {
      // Do not perform any action while verifying OTP.
      return;
    }
  
    if (otp === '') {
      Swal.fire('Please enter the OTP', '', 'warning');
      return;
    }
  
    try {
      // Send OTP verification request here
      const response = await axiosInstance.post('/verify-otp', {
        phoneNumber,
        otp,
      });
  
      if (response.data.valid) {
        // Once OTP is verified, you'll receive a token if valid
        if (response.data.token) {
          // Store the token in localStorage
          localStorage.setItem('token', response.data.token);
  
          
          setOtp('');
          navigate('/')
        } else {
          Swal.fire('Invalid OTP', 'Please enter a valid OTP', 'error');
        }
      } else {
        Swal.fire('Invalid OTP', 'Please enter a valid OTP', 'error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Swal.fire('Error', 'An error occurred while verifying OTP', 'error');
    } finally {
      setIsVerifyingOTP(false);
    }
  };
  

  const sendOTP = async () => {
    try {
      // Send OTP to the user's phone number
      const response = await axiosInstance.post('/send-otp', {
        phoneNumber,
      });

      if (response.data.sent) {
        Swal.fire('OTP Sent', 'An OTP has been sent to your phone', 'success');
        setOtpRequested(true); // Show OTP input and verification button
      } else {
        Swal.fire('Failed to Send OTP', 'Please try again later', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire('Error', 'An error occurred while sending OTP', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otpRequested) {
      // Handle OTP login
      handleOTPLogin();
    } else {
      // Handle email login
      handleEmailLogin();
    }
  };

  return (
    <div className="loginpage">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="login-container">
        <div className="left-login">
          <form className="loginForm" onSubmit={(e) => handleSubmit(e)}>
            <h3 className="tag1">Email Login</h3>
            <label className="label1" htmlFor="username">
              Email
            </label>
            <input
              className="input1"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="username"
            />

            <label className="label1" htmlFor="password">
              Password
            </label>
            <input
              className="input1"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />

            <button className="loginButton" type="submit">
              {otpRequested ? 'Enter OTP' : 'Log In'}
            </button>
            <Link to="/forgotpassword">Forgot Password?</Link>
          </form>
          <div className="login-links">
            <div className="social">
              <div className="go">
                <i className="fab fa-google"></i> <Link to={'/signup'}>SIGNUP</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="or-divider">
          <p className="or-text">OR</p>
        </div>
        <div className="right-login">
          <form className="otp-login-form" onSubmit={(e) => e.preventDefault()}>
            <h3 className="tag1">Mobile OTP Login</h3>
            {otpRequested ? (
              <div>
                <label className="label1" htmlFor="otp">
                  OTP
                </label>
                <input
                  className="input1"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  id="otp"
                />
                <button
                  className="loginButton"
                  type="button"
                  onClick={handleOTPLogin}
                  disabled={isVerifyingOTP}
                >
                  {isVerifyingOTP ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            ) : (
              <div>
                <label className="label1" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className="input1"
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  id="phoneNumber"
                />
                <button
                  className="loginButton"
                  type="button"
                  onClick={() => sendOTP()}
                >
                  Request OTP
                </button>
                
              </div>
            )}
            
            <Link to="/partnerlogin">Delivery Partner Login</Link>
            <Link to="/restaurantlogin">Restaurant  Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
