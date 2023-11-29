import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../UserComponets/Home/Header';
import axiosInstance from '../../../utils/axiosInstance';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  TablePagination
} from '@mui/material';

function UniqueOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { restaurantId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axiosInstance.get('/api/restaurantorders/orders', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        setOrders(ordersResponse.data.orders);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [restaurantId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartResponse = await axiosInstance.get('/api/cart', {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openCustomModal = (order) => {
    Swal.fire({
      title: 'Order Details',
      html: `
        <style>
          .bright-black {
            color: #000;
          }
          .wider-modal {
            max-width: 800px;
          }
        </style>
        <p class="bright-black">Order ID: ${order._id}</p>
        <p class="bright-black">Customer Name: ${order.customerName}</p>
        <p class="bright-black">Delivery Address: ${order.deliveryAddress}</p>
        <p class="bright-black">Order Date: ${order.orderDate}</p>
        <p class="bright-black">Status: ${order.status}</p>
        <h4 class="bright-black">Order Items</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="bright-black">Item Name</th>
              <th class="bright-black">Price</th>
              <th class="bright-black">Quantity</th>
              <th class="bright-black">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${generateCartItemsHTML(order.cart)}
          </tbody>
        </table>
        <p class="bright-black total mt-5">Amount: $${order.subtotal}</p>
        <p class="bright-black total1">Tax Amount: $${order.tax}</p>
        <p class="bright-black total1">Delivery Charge: $${order.deliveryCharge}</p>
        <p class="bright-black total1">Total Amount: $${order.totalAmount}</p>`,
      customClass: {
        popup: 'wider-modal',
        content: 'wider-modal',
      },
    });
  };

  function generateCartItemsHTML(cartItems) {
    return cartItems.map((item) => `
      <tr>
        <td class="bright-black">${item.itemName}</td>
        <td class="bright-black">$${item.price}</td>
        <td class="bright-black">${item.quantity}</td>
        <td class="bright-black">$${item.amount}</td>
      </tr>`
    ).join('');
  }

  return (
    <>
      <Header />
      <div>
        <h2 className="order-management">Your Orders</h2>
        <div>
          <div className="card-order">
            <div className="card-body">
              {isLoading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order No.</TableCell>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Delivery Address</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : orders
                      ).map((order, index) => (
                        <TableRow key={order._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{order._id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.deliveryAddress}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>${order.totalAmount}</TableCell>
                          <TableCell>
                            <Button onClick={() => openCustomModal(order)}>View Orders</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UniqueOrderManagement;
