import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'; // Import js-cookie

function AdminHeader() {
  const navigate = useNavigate();

  const adminLogout1 = (e) => {
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
        // Remove the admin token from cookies or local storage
        navigate('/admin')
        Cookies.remove('adminToken');
    };}
    )};
    
  const verifyAdminToken = () => {
    const adminToken = Cookies.get('adminToken');

    if (!adminToken) {
      navigate('/admin');
    }
  };

  React.useEffect(() => {
    verifyAdminToken();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg adminHeadernav" style={{ backgroundColor: 'black' }}>
      <div className="container-fluid">
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <a className="navbar-brand" href="/adminHome" style={{ color: 'white' }}>
          WELCOME ADMIN
        </a>
           
           
          </ul>
          <form className="d-flex">
            <button className="btn adminLogoutBtn" style={{ color: 'white' }} onClick={adminLogout1}>
              Logout
            </button>
          </form>        
        </div>
      </div>
    </nav>
  );
}

export default AdminHeader;
