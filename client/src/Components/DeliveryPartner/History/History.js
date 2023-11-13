import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import DeliveryHeader from '../DeliveryHeader/DeliveryHeader';
import Container from 'react-bootstrap/Container';
import axiosInstance from '../../../utils/axiosInstance'
import './History.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { partnerId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axiosInstance.get(`/api/partnerorders/${partnerId}`);
        // Filter orders with status "Delivered" or "Not Delivered"
        const filteredOrders = ordersResponse.data.orders.filter(
          (order) => order.status === 'Delivered' || order.status === 'Not Delivered'
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [partnerId]);

  const openCustomModal = (order) => {
    // Display order details in a custom modal
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

  return (
    <>
      <DeliveryHeader />

      <Container>
        <h2 className="order-management mt-5">Orders</h2>
        <div>
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
                    <Button
                      className="btn btn-primary"
                      onClick={() => openCustomModal(order)}
                    >
                      View Details
                    </Button>
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
      </Container>
    </>
  );
}

export default OrderManagement;
