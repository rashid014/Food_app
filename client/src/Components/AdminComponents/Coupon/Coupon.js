import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './Coupon.css'; // Import your CSS file
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    name: '',
    percentage: '',
    expiryDate: '',
  });

  // Function to fetch coupons from the backend
  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/viewcoupons');
      setCoupons(response.data); // Assuming your backend sends an array of coupon objects
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  // Fetch coupons when the component mounts
  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddCouponDialog = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Coupon',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Coupon Name">' +
        '<input id="swal-input2" class="swal2-input" type="number" placeholder="Percentage">' +
        '<input id="swal-input3" class="swal2-input" type="date" placeholder="Expiry Date">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
        ];
      },
    });

    if (formValues) {
      const [name, percentage, expiryDate] = formValues;
      const coupon = {
        name,
        percentage,
        expiryDate,
      };

      // Send a POST request to add the coupon to the backend
      try {
        await axios.post('http://localhost:4000/api/coupons', coupon);
        // After successfully adding, fetch coupons again to update the list
        fetchCoupons();
      } catch (error) {
        console.error('Error adding coupon:', error);
      }
    }
  };

  const removeCoupon = async (index) => {
    // Get the coupon ID
    const couponId = coupons[index]._id;
  
    // Show a confirmation dialog using Swal
    const confirmationResult = await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this coupon?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel',
    });
  
    if (confirmationResult.isConfirmed) {
      try {
        // Send a DELETE request to remove the coupon from the backend
        await axios.patch(`http://localhost:4000/api/coupons/${couponId}`);
        // After successfully deleting, fetch coupons again to update the list
        fetchCoupons();
        // Show a success message using Swal.fire
        Swal.fire({
          icon: 'success',
          title: 'Coupon Deleted',
          showConfirmButton: false,
          timer: 1500, // Automatically close the success message after 1.5 seconds
        });
      } catch (error) {
        // Show an error message using Swal.fire
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error deleting the coupon',
        });
        console.error('Error deleting coupon:', error);
      }
    }
  };
  

  return (
    <div>
      <h1>Coupon Management</h1>
      <Button variant="contained" onClick={openAddCouponDialog}>Add Coupon</Button>

      {/* List of Coupons in a Material-UI Table */}
      <div className='card-coupon'>
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
                    <Button variant="contained" onClick={() => removeCoupon(index)}>Delete</Button>
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

export default CouponManagement;
