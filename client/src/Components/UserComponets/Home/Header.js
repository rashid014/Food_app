import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Keep your custom styles if needed
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../../Redux/usernameReducer';
import { changeImage } from '../../../Redux/userimageReducer';
import { verifyUserToken } from '../../../utils/Constants';
// import {WEYGIAT} from '../../../util/WEYGIAT.jpg'

const BLANK_IMAGE_SRC = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#000000' }}>
      <div className="container-fluid">
      {/* <img src={WEYGIAT} className="logo" style={{ width: '100px' }} alt="Your Logo" /> */}
        <Link to="/" className="navbar-brand" style={{ color: 'white' }}>
          {isLoggedIn && (
            <img src={userImage || BLANK_IMAGE_SRC} className="userLogo" style={{ width: '30px' }} alt="User Logo" />
          )}
        </Link>
        <div className="d-flex align-items-center">
          {isLoggedIn && (
         <div className="navbar-nav">
         <Link to="/Profile" style={{ color: 'white', textDecoration: 'none' }}>
           <h6 className="nav-link active" aria-current="page" style={{ marginRight: '20px' ,color:'white'}}>
             My Profile
           </h6>
         </Link>
         <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
           <h6 className="nav-link active" aria-current="page" style={{ marginRight: '20px',color:'white' }}>
             My Cart
           </h6>
         </Link>
       </div>

            
          )}
          {isLoggedIn && (
            <span className="navUserName" style={{ marginLeft: '10px', marginTop: '10px', color: 'white' }}>
              {name}
            </span>
          )}
          <button
            className="btn btn-danger userLogoutButton"
            onClick={isLoggedIn ? handleLogoutUser : () => navigate('/login')}
            type="submit"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
    </div>
  );
}

export default Header;
