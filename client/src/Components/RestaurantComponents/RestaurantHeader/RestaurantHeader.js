// Header.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './RestaurantHeader.css'; // Updated CSS file import
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);
  const [isKycApproved, setIsKycApproved] = useState(false);
  const restaurantName = useSelector((state) => state.restaurantName);
  const restaurantImage = useSelector((state) => state.restaurantImage);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwtsecret')}`,
        },
      });

      if (response.status === 200) {
        Cookies.remove('jwtsecret');
        navigate('/restaurantlogin');
      } else {
        // Handle logout failure, display an error message, etc.
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle network errors or other failures
    }
  };

  useEffect(() => {
    const token = Cookies.get('jwtsecret');

    if (!token) {
      navigate('/restaurantlogin');
    } else {
      // Fetch KYC status from your server
      axios
        .get(`http://localhost:4000/api/kyc-status/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.isApproved) {
            setIsKycApproved(true);
          }
        })
        .catch((error) => {
          console.error('Error fetching KYC status:', error);
        });

      // Fetch other restaurant data
      axios
        .post('http://localhost:4000/api/verifytoken1', JSON.stringify({ token }), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data.restaurantName && res.data.restaurantId) {
            const { restaurantName, restaurantId } = res.data;
            setRestaurantData({ restaurantName, restaurantId });
          } else {
            console.error('restaurantName or restaurantId is missing in the response data.');
          }
        })
        .catch((error) => {
          console.error('Token verification error:', error);
        });
    }
  }, [navigate, restaurantId]);

  return (
    <nav className="Unique4-navbar">
      <div className="Unique4-navbar-brand">
        <img src={restaurantImage} alt="Restaurant" className="Unique4-brand-logo" />
        {restaurantData && (
          <>
            <p className="Unique4-brand-name">{restaurantData.restaurantName}</p>
          </>
        )}
      </div>
      <ul className="Unique4-nav-list">
        {isKycApproved ? (
          <>
            <li className="Unique4-nav-item">
              <Link to={`/restaurantmenu/${restaurantId}`} className="Unique4-nav-link">
                Menu Management
              </Link>
            </li>
            <li className="Unique4-nav-item">
              <Link to={`/ordermanagement/${restaurantId}`} className="Unique4-nav-link">
                Orders
              </Link>
            </li>
            <li className="Unique4-nav-item">
              <Link to={`/payments/${restaurantId}`} className="Unique4-nav-link">
                Payments
              </Link>
            </li>
            <li className="Unique4-nav-item">
              <Link to={`/profile/${restaurantId}`} className="Unique4-nav-link">
                Profile
              </Link>
            </li>
          </>
        ) : null}

        <li className="Unique4-nav-item">
          <button className="Unique4-nav-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
