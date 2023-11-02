import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminHeader from '../Header/AdminHeader'
import SideNavbar from '../SideNav/SideNavbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function RestaurantPayment() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { restaurantId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch orders from the server
        const ordersResponse = await axios.get(
          'http://localhost:4000/api/restaurantpayment/orders'
        );
  
        // Filter orders with a status other than 'Pending'
        const filteredOrders = ordersResponse.data.orders.filter(
          (order) => order.status !== 'Pending'
        );
  
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const confirmOrder = (order) => {

      // If the payment status is 'Paid', you can confirm the order and set the payment status to 'Payment Approved'
      // Send a request to the server to confirm the order and update the payment status
      const requestData = {
        orderId: order._id,
        // Update the order status to "Confirmed"
        paymentStatus: 'Payment Approved', // Update the payment status
      };
  
      axios
        .post('http://localhost:4000/api/restaurant/confirm-payment', requestData)
        .then((response) => {
          // Handle the response, e.g., show a success message
          console.log(`Order ${order._id} confirmed successfully.`);
          // Optionally, you can update the local state to reflect the change
          setOrders((prevOrders) => {
            const updatedOrders = prevOrders.map((o) =>
              o._id === order._id ? { ...o, paymentStatus: 'Payment Approved' } : o
            );
            return updatedOrders;
          });
        })
        .catch((error) => {
          // Handle any errors, e.g., show an error message
          console.error(`Error confirming order ${order._id}:`, error);
        });
    
  };
  
  const rejectOrder = (order) => {
    // Send a request to the server to reject the order and update the payment status to 'Payment Not Approved'
    const requestData = {
      orderId: order._id,
       // Update the order status to "Rejected"
      paymentStatus: 'Payment Not Approved', // Update the payment status
    };
  
    axios .post('http://localhost:4000/api/restaurant/reject-payment', requestData)
      .then((response) => {
        // Handle the response, e.g., show a success message
        console.log(`Order ${order._id} rejected successfully.`);
        // Optionally, you can update the local state to reflect the change
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) =>
            o._id === order._id ? { ...o, paymentStatus: 'Payment Not Approved' } : o
          );
          return updatedOrders;
        });
      })
      .catch((error) => {
        // Handle any errors, e.g., show an error message
        console.error(`Error rejecting order ${order._id}:`, error);
      });
  };
  

  const getTotalAmount = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryCharge = 5; // Example delivery charge
    const taxRate = 0.05; // 5% tax rate

    const tax = (subtotal * taxRate).toFixed(2);
    const totalAmount = (subtotal + deliveryCharge + parseFloat(tax)).toFixed(2);

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax,
      deliveryCharge: deliveryCharge.toFixed(2),
      totalAmount: totalAmount,
    };
  };

  const generateCartItemsHTML = (cartItems) => {
    return cartItems.map((item) => `
      <tr>
        <td class="bright-black">${item.itemName}</td>
        <td class="bright-black">$${item.price}</td>
        <td class="bright-black">${item.quantity}</td>
        <td class="bright-black">$${item.amount}</td>
      </tr>`
    ).join('');
  }

  const openCustomModal = (order) => {
    Swal.fire({
      title: 'Order Details',
      html: `
        <style>
          /* Define a CSS class to set the text color to bright black */
          .bright-black {
            color: #000;
          }
          /* Define a CSS class to increase the width of the modal */
          .wider-modal {
            max-width: 800px; /* Adjust the width as needed */
          }
        </style>
        <p class="bright-black">Order ID: ${order._id}</p>
        <p class="bright-black">Customer Name: ${order.customerName}</p>
        <p class="bright-black">Delivery Address: ${order.deliveryAddress}</p>
        <p class="bright-black">Order Date: ${order.orderDate}</p>
        <p class="bright-black">Status: ${order.status}</p>
       
        <h4 class="bright-black">Order Items</h4>
        <table>
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
      showCancelButton: true,
      confirmButtonText: 'Confirm Payment',
      cancelButtonText: 'Reject Payment',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
        popup: 'wider-modal', // Apply the wider-modal class to the popup
        content: 'wider-modal', // Apply the wider-modal class to the content
      },
    }).then((result) => {
      if (result.isConfirmed) {
        confirmOrder(order);
      } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        rejectOrder(order);
      }
    });
  };

  return (
    <div>
      <AdminHeader />
      <h2 className="order-management mt-5">Restaurant Payment</h2>
      <div>
      <SideNavbar />
        
        <div className="card-one"> 
          <div className="card-body">
           
             <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Delivery Address</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Partner Payment</TableCell>
            <TableCell>Restaurant Payment</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.deliveryAddress}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>{order.partnerPayment}</TableCell>
              <TableCell>{order.restaurantPayment}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                <button onClick={() => openCustomModal(order)}>View Orders</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </div>
        </div>
      </div>
      {selectedOrder && (
        // Display the selected order details in a popup
        <div>
          <h3>Order Details</h3>
          <div className="card">
            <div className="card-header">Order Details</div>
            <div className="card-body">
              <p>Order ID: {selectedOrder._id}</p>
              <p>Customer Name: {selectedOrder.customerName}</p>
              <p>Delivery Address: {selectedOrder.deliveryAddress}</p>
              <p>Restaurant Name: {selectedOrder.restaurantName}</p>
              <p>Order Date: {selectedOrder.orderDate}</p>
              <p>Status: {selectedOrder.status}</p>
              <h4>Order Items</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Total Amount: ${selectedOrder.totalAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantPayment;
