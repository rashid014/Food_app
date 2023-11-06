import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../UserComponets/Home/Header'


function UniqueOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { restaurantId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Make the GET request with the token in the headers
        const ordersResponse = await axios.get(
          'http://localhost:4000/api/restaurantorders/orders',
          {
            headers: {
              Authorization: localStorage.getItem('token'),// Assuming it's a Bearer token
            },
          }
        );
  
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
        <p class "bright-black">Delivery Address: ${order.deliveryAddress}</p>
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
        popup: 'wider-modal', // Apply the wider-modal class to the popup
        content: 'wider-modal', // Apply the wider-modal class to the content
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
      
      <h2 className="order-management ">Your Orders</h2>
      <div>
       
        <div className="card-order">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Delivery Address</th>
                    <th>Order Date</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.deliveryAddress}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.status}</td>
                      <td>${order.totalAmount}</td>
                      <td>
                        <button onClick={() => openCustomModal(order)}>View Orders</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              <div className="table-responsive">
                <table className="table table-bordered">
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
              </div>
              <p>Total Amount: ${selectedOrder.totalAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default UniqueOrderManagement;
