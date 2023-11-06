import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css'; // Keep your custom styles if needed
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../../Redux/usernameReducer';
import { changeImage } from '../../../Redux/userimageReducer';
import { verifyUserToken } from '../../../utils/Constants';
import Button from '@mui/material/Button'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Popover from '@mui/material/Popover';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import imgLogo from './foodie2.png'

// import {WEYGIAT} from '../../../util/WEYGIAT.jpg'

const BLANK_IMAGE_SRC = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleLogoutUser = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Logout?',
      text: 'Do you want to Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        dispatch({ type: 'logout' });
        navigate('/');
      }
    });
  };

  useEffect(() => {
    const Token = localStorage.getItem('token');

    if (!Token) {
      navigate('/');
    } else {
      const body = JSON.stringify({ Token });
      axios
        .post(verifyUserToken, body, { headers: { 'Content-Type': 'application/json' } })
        .then((res) => {
          dispatch(change(res.data.user.userName));
          dispatch(changeImage(res.data.user.image));
        });
    }
  }, [dispatch]);

  
  const userImage = useSelector((state) => state.userImage);
  const { name, email } = useSelector((state) => state.userProfile);

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="custom-header-container1">
     
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#000000', width:"100%" }}>
    <div className="container-fluid"  style={{ backgroundColor: '#000000', height: '80px',width:"1180px" }}>
    {/* <div className="container-fluid"> */}
    
   
    <Link to="/">
      <img
        src={imgLogo} // Replace with the image path
        alt="Your Logo"
        style={{
          height: '80px', // Customize the height as needed
          textDecoration: 'none', // Remove underline
        }}
      />
    </Link>


</div>
      {/* <img src="https://cdn.dribbble.com/users/2512810/screenshots/17592344/media/db7a6f99501c0bd618821204ded13b4e.png?resize=400x0" className="logo" style={{ width: '100px' }} alt="Your Logo" /> */}

      <Button>
      </Button>
      <Popover
        id="menu-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Button onClick={() => navigate('/profile')}>Profile</Button>
        <Button onClick={isLoggedIn ? handleLogoutUser : () => navigate('/login')}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </Popover>
        <div className="d-flex align-items-center">
          {isLoggedIn && (
         <div className="navbar-nav">
         
         <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon />
            <Button className="nav-link active" aria-current="page" style={{ marginLeft: '10px', color: 'white' }}>
              Cart
            </Button>
          </Link>
</div>

{isLoggedIn && (
            <span className="navUserName" style={{ marginLeft: '10px', marginTop: '10px', color: 'white' }}>
              {name}
            </span>
          )}
<Button
        aria-describedby="menu-popover"
        onClick={handleClick}
        style={{ color: 'white' }}
      >
        {isLoggedIn && (
          <img src={userImage || BLANK_IMAGE_SRC} className="userLogo" style={{ width: '30px' }} alt="User Logo" />
        )}
      </Button>
      <Popover
        id="menu-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Button onClick={() => navigate('/profile')}>  
        <AccountBoxIcon />
        My Profile</Button>
        <Button onClick={() => navigate('/userorderview')}>  
        <AccountBoxIcon />
        My Orders</Button>
        <Button onClick={isLoggedIn ? handleLogoutUser : () => navigate('/login')}>
          <LogoutIcon/>
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </Popover>
       </div>

            
          )}
         
         <button
          className="btn btn-danger userLogoutButton"
          style={{ backgroundColor: 'black' }}
          onClick={isLoggedIn ? handleLogoutUser : () => navigate('/login')}
          type="submit"
        >
          {isLoggedIn ? '' : (
            <div>
              <LoginIcon style={{ color: 'white' }} />
              Login
            </div>
          )}
        </button>

        
      </div>
    </nav>
    </div>
  );
}

export default Header;
