import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import Swal from 'sweetalert2';

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
        navigate('/admin');
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg adminHeadernav">
      <div className="container-fluid">
        <a className="navbar-brand" href="/adminHome" style={{ color: 'white' }}>
          WELCOME ADMIN
        </a>
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
           
           
           
          </ul>
          <form className="d-flex">
            <button className="btn adminLogoutBtn" onClick={adminLogout1}>
              Logout
            </button>
          </form>        
        </div>
      </div>
    </nav>
  );
}

export default AdminHeader;
