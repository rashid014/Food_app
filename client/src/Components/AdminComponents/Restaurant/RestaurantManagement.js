import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantManagement.css'
import AdminHeader from '../Header/AdminHeader';
import SideNavbar from '../SideNav/SideNavbar';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    // Fetch the list of restaurants, including their block/unblock status
    axios
      .get('http://localhost:4000/api/restaurant-management') // Corrected endpoint
      .then((response) => {
        setRestaurants(response.data);
        console.log('response:', response.data); // Corrected log statement
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
      });
  };
  

  const toggleBlockStatus = (restaurantId, isBlocked) => {
    // Send a request to the backend to toggle the block/unblock status
    axios.put(`http://localhost:4000/api/restaurant-management/${restaurantId}`, { isBlocked: !isBlocked })
      .then(() => {
        // Refresh the list of restaurants
        fetchRestaurants();
      }).catch((error) => {
        console.error('Error toggling block status:', error);
      });
  };

  return (
    <div>
       <AdminHeader/>
       <div>
      <h1>Restaurant Management</h1>
      </div>
      <div className="horizontal-container">
        <SideNavbar />
      
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Restaurant Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant, index) => (
            <tr key={restaurant._id}>
              <td>{index + 1}</td>
              <td>{restaurant.restaurantName}</td>
              <td>{restaurant.email}</td>
              <td>{restaurant.isBlocked ? 'Blocked' : 'Unblocked'}</td>
              <td>
                <button onClick={() => toggleBlockStatus(restaurant._id, restaurant.isBlocked)}>
                  {restaurant.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default RestaurantManagement;
