import React, { useState } from 'react';
import './DeliveryLogin.css'; // You can style it accordingly
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { changePartnerId } from '../../../Redux/partnerIdSlice'; // Import the action from your Redux slice
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DeliveryPartnerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const dispatch = useDispatch(); // Get the dispatch function
  const navigate = useNavigate(); // Get the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      validationErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:4000/api/partnerlogin', formData);

        if (response.status === 200) {
          const jwtToken = response.data.token;
          const partnerId = response.data.partnerId;
          dispatch(changePartnerId(partnerId));

          // Store the JWT token in a cookie
          Cookies.set('partnerToken', jwtToken, { expires: 7 });

          // Redirect to the Delivery Partner dashboard or any other page
          navigate(`/partnerhome/${partnerId}`); // Navigate to the partner home page
        } else {
          // Handle server response errors here
          setLoginError('Server error. Please try again later.');
        }
      } catch (error) {
        console.error('Error:', error);

        if (error.response) {
          // Handle specific error responses from the server
          if (error.response.status === 401) {
            setLoginError('Incorrect email or password. Please try again.');
          } else {
            setLoginError('An error occurred. Please try again later.');
          }
        } else {
          // Handle network errors
          setLoginError('Network error. Please check your internet connection.');
        }
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Delivery Partner Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          {loginError && <div className="error-message">{loginError}</div>}
          <div>
            <Link to="/partnersignup">Register with Us!!</Link>
          </div>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default DeliveryPartnerLogin;
