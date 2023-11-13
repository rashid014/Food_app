import React, { useState } from 'react';
import './RestaurantSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance'

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantAddress: '', // New field for restaurant address
    restaurantImageFile: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Trim the value to remove leading/trailing spaces
    });

    // Clear the error for the field being changed
    setErrors({
      ...errors,
      [name]: '',
    });
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

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.restaurantName.trim()) {
      validationErrors.restaurantName = 'Restaurant Name is required';
    }

    // Address is required
    if (!formData.restaurantAddress.trim()) {
      validationErrors.restaurantAddress = 'Address is required';
    }

    if (!formData.restaurantImageFile) {
      validationErrors.restaurantImageFile = 'Restaurant image file is required';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.post('/api/signup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the content type for file uploads
          },
        });
        console.log('Server response:', response.data);
        navigate('/restaurantlogin');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="signup-form">
      <h2>Restaurant Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="restaurantName">Restaurant Name:</label>
          <input
            type="text"
            id="restaurantName"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            required
          />
          {errors.restaurantName && <div className="error-message">{errors.restaurantName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="restaurantAddress">Address:</label>
          <input
            type="text"
            id="restaurantAddress"
            name="restaurantAddress"
            value={formData.restaurantAddress}
            onChange={handleChange}
            required
          />
          {errors.restaurantAddress && <div className="error-message">{errors.restaurantAddress}</div>}
        </div>
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
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="restaurantImageFile">Upload Restaurant Image:</label>
          <input
            type="file"
            id="restaurantImageFile"
            name="restaurantImageFile"
            onChange={handleChange}
            accept="image/*"
            required
          />
          {errors.restaurantImageFile && (
            <div className="error-message">{errors.restaurantImageFile}</div>
          )}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
