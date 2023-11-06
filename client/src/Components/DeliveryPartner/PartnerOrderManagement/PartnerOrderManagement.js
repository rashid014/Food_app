import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import DeliveryHeader from '../DeliveryHeader/DeliveryHeader';
import './PartnerOrderManagement.css'
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
        const ordersResponse = await axios.get('http://localhost:4000/api/partnerorders');
        setOrders(ordersResponse.data.orders);
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

  const getTotalAmount = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryCharge = 5;
    const taxRate = 0.05;

    const tax = (subtotal * taxRate).toFixed(2);
    const totalAmount = (subtotal + deliveryCharge + parseFloat(tax)).toFixed(2);

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax,
      deliveryCharge: deliveryCharge.toFixed(2),
      totalAmount: totalAmount,
    };
  };

  const viewOrder = (order) => {
    setSelectedOrder(order);
  };

  const confirmOrder = (order) => {
    const requestData = {
      orderId: order._id,
      status: 'Delivery Partner Assigned',
      partnerId: partnerId,
    };

    axios
      .post('http://localhost:4000/api/restaurant/partneraccept', requestData)
      .then((response) => {
        console.log(`Order ${order._id} assigned to a delivery partner successfully.`);
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) =>
            o._id === order._id ? { ...o, status: 'Delivery Partner Assigned' } : o
          );
          return updatedOrders;
        });
      })
      .catch((error) => {
        console.error(`Error assigning delivery partner to order ${order._id}:`, error);
      });
  };

  const pickUpOrder = (order) => {
    const requestData = {
      orderId: order._id,
      status: 'Order Picked Up',
    };

    axios
      .post('http://localhost:4000/api/restaurant/pickuporder', requestData)
      .then((response) => {
        console.log(`Order ${order._id} has been picked up.`);
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) =>
            o._id === order._id ? { ...o, status: 'Order Picked Up' } : o
          );
          return updatedOrders;
        });
      })
      .catch((error) => {
        console.error(`Error picking up order ${order._id}:`, error);
      });
  };

  const skipOrder = (order) => {
    const requestData = {
      orderId: order._id,
    };

    axios
      .post('http://localhost:4000/api/restaurant/partnerskip', requestData)
      .then((response) => {
        console.log(`Order ${order._id} skipped successfully.`);
      })
      .catch((error) => {
        console.error(`Error skipping order ${order._id}:`, error);
      });
  };

  function generateCartItemsHTML(cartItems) {
    return cartItems
      .map(
        (item) => `
      <tr>
        <td class="bright-black">${item.itemName}</td>
        <td class="bright-black">$${item.price}</td>
        <td class="bright-black">${item.quantity}</td>
        <td class="bright-black">$${item.amount}</td>
      </tr>`
      )
      .join('');
  }

  const deliveredOrder = (order) => {
    // Handle the 'Delivered' action
    const requestData = {
      orderId: order._id,
      status: 'Delivered',
    };
  
    axios
      .post('http://localhost:4000/api/restaurant/deliverorder', requestData)
      .then((response) => {
        console.log(`Order ${order._id} has been delivered.`);
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) =>
            o._id === order._id ? { ...o, status: 'Delivered' } : o
          );
          return updatedOrders;
        });
      })
      .catch((error) => {
        console.error(`Error delivering order ${order._id}:`, error);
      });
  };
  
  const notDeliveredOrder = (order) => {
    // Handle the 'Not Delivered' action
    const requestData = {
      orderId: order._id,
      status: 'Not Delivered',
    };
  
    axios
      .post('http://localhost:4000/api/restaurant/notdeliverorder', requestData)
      .then((response) => {
        console.log(`Order ${order._id} has not been delivered.`);
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) =>
            o._id === order._id ? { ...o, status: 'Not Delivered' } : o
          );
          return updatedOrders;
        });
      })
      .catch((error) => {
        console.error(`Error marking order ${order._id} as not delivered:`, error);
      });
  };
  

  const openCustomModal = (order) => {
    let confirmButtonText;
    let cancelButtonText;
    let showCancelButton = true;
    let confirmButtonIcon = '';
    let confirmButtonColor = '';
    
    if (order.status === 'Delivery Partner Assigned') {
      confirmButtonText = 'Pick-Up';
      cancelButtonText = 'Reject';
    } else if (order.status === 'Order Picked Up') {
      if (order.isDelivered) {
        // If the order is delivered, show "Delivered" text with a green tick icon
        confirmButtonText = ' Not Delivered';
        confirmButtonIcon = 'success'; // SweetAlert2 success icon (tick mark)
        confirmButtonColor = '#4CAF50'; // Green color
      } else {
        // If the order is not delivered, show "Not Delivered" text with a red cross icon
        confirmButtonText = 'Delivered';
        confirmButtonIcon = 'error'; // SweetAlert2 error icon (cross mark)
        confirmButtonColor = '#FF5733'; // Red color
      }
    } else {
      showCancelButton = false;
      confirmButtonText = 'Accept';
      cancelButtonText = '';
    }
  
    Swal.fire({
      title: 'Order Details',
      html: `
        <style>
          .custom-modal {
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
        </style>
        <div class="custom-modal">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Customer Name:</strong> ${order.customerName}</p>
          <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
          <p><strong>Order Date:</strong> ${order.orderDate}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <h4>Order Items</h4>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${generateCartItemsHTML(order.cart)}
            </tbody>
          </table>
          <p class="custom-text">Amount: $${order.subtotal}</p>
          <p class="custom-text">Tax Amount: $${order.tax}</p>
          <p class="custom-text">Delivery Charge: $${order.deliveryCharge}</p>
          <p class="custom-text">Total Amount: $${order.totalAmount}</p>
        </div>`,
      showCancelButton: showCancelButton,
      confirmButtonText: confirmButtonText,
      confirmButtonIcon: confirmButtonIcon,
      confirmButtonColor: confirmButtonColor,
      cancelButtonText: cancelButtonText,
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (order.status === 'Order Picked Up') {
          deliveredOrder(order);
        } else if (order.status === 'Delivery Partner Assigned') {
          // Handle the 'Pick-Up' action
          pickUpOrder(order);
        } else {
          confirmOrder(order);
        }
      } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        if (order.status === 'Order Picked Up') {
          notDeliveredOrder(order);
        } else {
          skipOrder(order);
        }
      }
    });
  };
  


  

  return (
    <div>
      <DeliveryHeader />
      <h2 className="order-management mt-5">Orders</h2>
      
      <div className="row">
        {orders.map((order) => (
          <div className="col-md-4" key={order._id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Order ID: {order._id}</h5>
                <p className="card-text">Customer Name: {order.customerName}</p>
                <p className="card-text">Delivery Address: {order.deliveryAddress}</p>
                <p className="card-text">Order Date: {order.orderDate}</p>
                <p className="card-text">Status: {order.status}</p>
                <p className="card-text">Total Amount: ${order.totalAmount}</p>
                <p className="card-text">Payment Type: {order.paymentType}</p>

                {
        order.status === 'Delivered' || order.status === 'Not Delivered' ? (
          <div className={`status-card ${order.status === 'Delivered' ? 'delivered' : 'not-delivered'}`}>
        <p className="status-text">
        {order.status === 'Delivered' ? (
          <span style={{ color: 'green' }}>&#10004; Delivered</span>
        ) : (
          <span style={{ color: 'red' }}>&#10008; Not Delivered</span>
        )}
      </p>

      <p className="delivery-fee" style={{ color: 'green' }}>You received $5 as a delivery fee</p>

    </div>
  ) : (
    <Button
      className="btn btn-primary"
      onClick={() => openCustomModal(order)}
    >
      {order.status === 'Delivery Partner Assigned'
        ? 'Pick-Up'
        : order.status === 'Order Picked Up'
        ? 'Ready to Deliver'
        : 'Accept'}
    </Button>
  )
}




              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Order Details</Card.Title>
                <Card.Text>Order ID: {selectedOrder._id}</Card.Text>
                <Card.Text>Customer Name: {selectedOrder.customerName}</Card.Text>
                <Card.Text>Delivery Address: {selectedOrder.deliveryAddress}</Card.Text>
                <Card.Text>Restaurant Name: {selectedOrder.restaurantName}</Card.Text>
                <Card.Text>Order Date: {selectedOrder.orderDate}</Card.Text>
                <Card.Text>Status: {selectedOrder.status}</Card.Text>
                <h4>Order Items</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default OrderManagement;
