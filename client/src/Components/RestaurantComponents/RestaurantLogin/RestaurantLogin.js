import React, { useState } from 'react';
import './RestaurantLogin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changeId } from '../../../Redux/restaurantIdsReducer'; // Import the action from your Redux slice
import { Link } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(''); // New state for login error message
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear the error for the field being changed
    setErrors({
      ...errors,
      [name]: '',
    });
    // Clear the login error message when the user modifies the form
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
        // Make a POST request to your server for authentication
        const response = await axios.post('http://localhost:4000/api/restaurantlogin', formData);

        if (response.data.isBlocked) {
          alert('Your account is blocked. Please contact support.');
          return;
        }

        // Assuming your server responds with a JWT token and restaurantId
        const jwtToken = response.data.token;
        const restaurantId = response.data.restaurantId;
        const isBlocked = response.data.isBlocked; // Assuming your server sends isBlocked status

        if (isBlocked) {
          // Display a message or redirect to a blocked page
          console.error('Restaurant is blocked. Cannot log in.');
        } else {
          // Store the JWT token in a cookie
          Cookies.set('jwtsecret', jwtToken, { expires: 7 });

          // Dispatch the action to store restaurantId in Redux
          dispatch(changeId(restaurantId));

          // Redirect to the restaurantHome route with restaurantId in the URL
          navigate(`/restaurantHome/${restaurantId}`);
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle errors here, such as displaying an "Incorrect password" message
        setLoginError('Incorrect password. Please try again.');
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Restaurant Login</h2>
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
          {loginError && <div className="error-message">{loginError}</div>} {/* Display login error */}
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
            <Link to="/restaurantsignup">Sign Up with Us!</Link>
          </div>
    </div>
  );
};

export default Login;
