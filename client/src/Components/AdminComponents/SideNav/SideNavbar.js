// src/components/SideNavbar.js

import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import './SideNavbar'
function SideNavbar() {
  return (
    <nav className="side-nav col-md-2 ">
      <ul>
        <li>
          <Link to="/adminHome">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin-approval">Restuarent Approval</Link>
        </li>
        <li>
          <Link to="/restaurant-management">Restaurant Management</Link>
        </li>
        <li>
          <Link to="/partner-approval">Partner Approval</Link>
        </li>
        <li>
          <Link to="/admin-payment ">Restaurant Payment</Link>
        </li>
        <li>
          <Link to="/restaurants">Restaurants</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/promocode">Promocode</Link>
        </li>
        <li>
          <Link to="/reviews">Reviews</Link>
        </li>
        <li>
          <Link to="/required-documents">Required Documents</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNavbar;
