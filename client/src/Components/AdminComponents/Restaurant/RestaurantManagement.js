import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantManagement.css'
import AdminHeader from '../Header/AdminHeader';
import SideNavbar from '../SideNav/SideNavbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'; 

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
      
       <div className='hey' style={{paddingTop:'0px'}}>
       <AdminHeader/>
      <h1>Restaurant Management</h1>
      </div>
      <div className="horizontal-container">
        <SideNavbar />
        <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Restaurant Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurants.map((restaurant, index) => (
            <TableRow key={restaurant._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{restaurant.restaurantName}</TableCell>
              <TableCell>{restaurant.email}</TableCell>
              <TableCell>{restaurant.isBlocked ? 'Blocked' : 'Unblocked'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={restaurant.isBlocked ? 'success' : 'error'}
                  onClick={() => toggleBlockStatus(restaurant._id, restaurant.isBlocked)}
                >
                  {restaurant.isBlocked ? 'Unblock' : 'Block'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </div>
  );
};

export default RestaurantManagement;
