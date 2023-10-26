import React, { useState ,useEffect} from 'react';
import './AdminDash.css';
import SideNavbar from '../SideNav/SideNavbar';
import Header from '../../UserComponets/Home/Header';
import AdminHeader from '../Header/AdminHeader';
import img from './admindash.jpg';
function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const fetchOrders = () => {
    // Fetch orders and update the 'orders' state
  };

  const fetchRestaurants = () => {
    // Fetch restaurants and update the 'restaurants' state
  };

  const fetchMenuItems = () => {
    // Fetch menu items and update the 'menuItems' state
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchOrders();
    fetchRestaurants();
    fetchMenuItems();
  }, []);

  return (
    <div className="container-fluid">
      <AdminHeader />
      <div className="horizontal-container">
        <SideNavbar />
        <img src={img} alt="Admin dashboard" width="100%" />
      </div>
    </div>
  );
  
}

export default AdminDashboard;


