import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { adminPostLogin } from '../../utils/Constants';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'; // Import js-cookie

import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      email,
      password,
    });

    if (email === '' || password === '') {
      Swal.fire('Please Fill All the Fields', 'All fields are required.', 'error');
    } else {
      try {
        let admin = await axios.post(adminPostLogin, body, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (admin.data.status === 'ok') {
          // Save the admin token to a cookie
          Cookies.set('adminToken', admin.data.token);

          // Redirect to the admin home page
          navigate('/adminHome');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid Credentials!',
          });
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Login</h1>
        <form onSubmit={(e) => handleAdminLogin(e)} className="admin-login-form">
          <div className="admin-input-fields">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input-box"
              placeholder="Admin Id"
            />
          </div>
          <div className="admin-input-fields">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input-box"
              placeholder="Password"
            />
          </div>
          <input type="submit" value="Login" className="admin-login-btn" />
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
