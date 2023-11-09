import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
import DeliveryHeader from '../DeliveryHeader/DeliveryHeader';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { partnerId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axios.get(`http://localhost:4000/api/partnerorders/${partnerId}`);
        // Filter orders with status other than 'Pending' and 'Confirmed'
        const filteredOrders = ordersResponse.data.orders.filter(order => !['Pending', 'Confirmed'].includes(order.status));
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartResponse = await axios.get('http://localhost:4000/api/cart', {
          headers: {
            Authorization: token,
          },
        });

        if (cartResponse.data && cartResponse.data.cartItems) {
          setCart(cartResponse.data.cartItems);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalAmountToPay = orders
  .filter((order) => order.paymentType === 'COD' && (order.status === 'Delivered' || order.status === 'Not Delivered'))
  .reduce((total, order) => total + parseFloat(order.totalAmount), 0);


console.log('Total amount to pay for COD orders: $' + totalAmountToPay.toFixed(2));
const totalAmountReceivedByDeliveryPartner = orders
  .filter((order) => (order.status === 'Delivered' || order.status === 'Not Delivered'))
  .reduce((total, order) => total + parseFloat(order.deliveryCharge), 0);


  // ... Other functions and JSX

  return (
    <>
    <DeliveryHeader />
    <div>
      
      <h2 className="order-management mt-5">Your Payments</h2>
      <p>Total amount to pay for COD orders: ${totalAmountToPay.toFixed(2)}</p>
      <p>Total amount received by the delivery partner for Delivered/Not Delivered orders: ${totalAmountReceivedByDeliveryPartner.toFixed(2)}</p>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Your Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.deliveryAddress}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.paymentType}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  {
                    order.status === 'Delivered' || order.status === 'Not Delivered' ? (
                      <div className={`status ${order.status === 'Delivered' ? 'delivered' : 'not-delivered'}`}>
                        <p className="new">
                          {order.status === 'Delivered' ? (
                           <p className='hey' style={{color:'green'}}>You received $5 as a delivery fee</p> 
                          ) : (
                            <span style={{ color: 'red' }}></span>
                          )}
                        </p>

                        
                      </div>
                    ) : (
                      <p className='hey' style={{color:'#ff8c00 '}}>Payment Pending</p>
                    )
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedOrder && (
        <div>
          {/* Render order details for the selected order */}
        </div>
      )}
    </div>
    </>
  );
}

export default OrderManagement;
