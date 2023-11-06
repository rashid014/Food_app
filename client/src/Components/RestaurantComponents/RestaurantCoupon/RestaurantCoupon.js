import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantHeader from '../RestaurantHeader/RestaurantHeader'
import axios from 'axios';

import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

function RestaurantCouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const {restaurantId}=useParams();
 console.log("rettttt"+restaurantId)
  // Function to fetch coupons from the backend
  const fetchCoupons = async () => {
    try {
        console.log("first"+restaurantId)
      const response = await axios.get('http://localhost:4000/api/viewcoupons');
      setCoupons(response.data); // Assuming your backend sends an array of coupon objects
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const fetchRestaurantData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/restaurant/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };
  // Fetch coupons when the component mounts
  useEffect(() => {
    fetchRestaurantData();
    fetchCoupons();
  
    // Load selected state from local storage and apply it to coupons
    const updatedCoupons = coupons.map((coupon) => ({
      ...coupon,
      isSelected: localStorage.getItem(coupon._id) === 'true',
    }));
  
    setCoupons(updatedCoupons);
  }, [restaurantId]);
  

  const handleSelectCoupon = async (coupon) => {
    try {
      const response = await axios.post('http://localhost:4000/api/selectcoupon', {
        restaurantId, // Include your restaurant ID here
        couponId: coupon._id,
      });
  
      if (response.status === 200) {
        const { isSelected } = response.data; // Extract the isSelected value from the response
  
        if (response.status === 200) {
          setIsSelected(true);
        }
      }
    } catch (error) {
      console.error('Error selecting coupon:', error);
    }
  };
  
  // Function to handle deselecting a coupon
  const handleDeselectCoupon = async (coupon) => {
    try {
      const response = await axios.post('http://localhost:4000/api/deselectcoupon', {
        restaurantId, // Include your restaurant ID here
        couponId: coupon._id,
      });

      if (response.status === 200) {
        const { isSelected } = response.data; 
        // After deselecting, update the local state
        setCoupons((prevCoupons) =>
          prevCoupons.map((c) =>
            c._id === coupon._id ? { ...c, isSelected: false } : c
          )
        );
      }
    } catch (error) {
      console.error('Error deselecting coupon:', error);
    }
  };

  function renderSelectButton(coupon) {
    const isSelected = coupon.selectedCoupons && coupon.selectedCoupons.find((selectedCoupon) => selectedCoupon.coupon && selectedCoupon.coupon.equals(coupon._id) && selectedCoupon.isSelected);
  
    const handleButtonClick = isSelected ? handleDeselectCoupon : handleSelectCoupon;
  
    return (
      <Button onClick={() => handleButtonClick(coupon)}>
        {isSelected ? "Unsubscribe" : "Subscribe"}
      </Button>
    );
  }
  
  

  return (
    <div>
        
        <RestaurantHeader />
      <h1>Coupon Management</h1>
      {/* List of Coupons in a Material-UI Table */}
      <div className="card-coupon">
        
     
  <TableContainer component={Paper} style={{ height: '100vh', width: '100%' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Percentage</TableCell>
          <TableCell>Expiry Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {coupons.map((coupon, index) => (
          <TableRow key={index}>
            <TableCell>{coupon.name}</TableCell>
            <TableCell>{coupon.percentage}%</TableCell>
            <TableCell>{coupon.expiryDate}</TableCell>
            <TableCell>
            {renderSelectButton(coupon) }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>


      </div>
    </div>
  );
}

export default RestaurantCouponManagement;
