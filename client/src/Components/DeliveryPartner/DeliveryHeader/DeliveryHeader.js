import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './DeliveryHeader.css';

const Header = ({ partnerName }) => {
 
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token from the cookies
    Cookies.remove('partnerToken');

    // Navigate to the login page or any other appropriate page
    navigate('/partnerlogin');
  };

  const verifyPartnerToken = () => {
    const partnerToken = Cookies.get('partnerToken');

    if (!partnerToken) {
      navigate('/partnerlogin');
    }
  };

  React.useEffect(() => {
    verifyPartnerToken();
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Link to="/partnerhome/:partnerId" className="navbar-brand">
        <Navbar.Brand>Delivery Partner {partnerName}</Navbar.Brand>
      </Link>
      <Navbar.Collapse className="justify-content-end">
      <Nav.Link className="logout-button" onClick={handleLogout}>
      Logout
    </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
