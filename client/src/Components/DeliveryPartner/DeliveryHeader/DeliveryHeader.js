import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './DeliveryHeader.css'

const Navbar = ({ partnerName}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token from the cookies
    Cookies.remove('partnerToken');



    // Navigate to the login page or any other appropriate page
    navigate('/partnerlogin');
  };

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="partner-name">Delivery Partner: {partnerName}</div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
