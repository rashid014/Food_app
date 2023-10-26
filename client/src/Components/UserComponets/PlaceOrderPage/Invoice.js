import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../Home/Header';

const OrderSuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOrderCancelled, setOrderCancelled] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCancelOrder = async () => {
    // Show a confirmation dialog using Swal
    const result = await Swal.fire({
      title: 'Cancel Order',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        // Send a request to delete the order
        await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
        setOrderCancelled(true); // Set the cancellation status to true
        // Update the order status
        setOrderDetails((prevOrderDetails) => ({
          ...prevOrderDetails,
          status: 'Cancelled',
        }));
        // Redirect to the dashboard or another appropriate page
      } catch (error) {
        console.error('Error canceling order:', error);
      }
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/orders/${orderId}`);
        if (response.data) {
          setOrderDetails(response.data);
          setOrderCancelled(!response.data.isPresent); // Set the cancellation status based on isPresent
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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

  return (
    <div className="order-container mt-5">
      <Header />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="cardorder-success-card">
            <div className="card-body-success">
              <h2 className="text-center order-success-header">
                {isOrderCancelled ? 'Cancelled Order' : 'Order Placed Successfully'}
              </h2>
              <p className="text-center order-success-message">
                {isOrderCancelled
                  ? 'Your order has been cancelled.'
                  : 'Thank you for your order. Your order has been successfully placed.'}
              </p>
              {orderDetails && (
                <div>
                  <p>Order ID: {orderDetails._id}</p>
                  <p>Customer Name: {orderDetails.customerName}</p>
                  <p className="text-center order-success-message">
                    Contact Number: {orderDetails.contactNumber}
                  </p>
                  <p className="text-center order-success-message">
                    Delivery Address: {orderDetails.deliveryAddress}
                  </p>
                  <p className="text-center order-success-message">
                    Status: {orderDetails.isPresent ? 'Pending' : 'Cancelled'}
                  </p>
                  {/* Render more details as needed */}
                </div>
             ) }

              <div className="col-md-6">
                {cart.map((item) => (
                  <div className="row unique6-cart-item mb-3" key={item._id}>
                    <div className="col">{item.name}</div>
                    <div className="col">${item.price}</div>
                    <div className="col">{item.quantity}</div>
                    <div className="col">${item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="unique6-order-details">
                <div className="unique6-order-detail checkout-item">
                  <span className="unique6-checkout-label">Subtotal:</span>
                  <span className="unique6-checkout-value">${getTotalAmount().subtotal}</span>
                </div>
                <div className="unique6-order-detail checkout-item">
                  <span className="unique6-checkout-label">Tax (5.00%):</span>
                  <span className="unique6-checkout-value">${getTotalAmount().tax}</span>
                </div>
                <div className="unique6-order-detail checkout-item">
                  <span className="unique6-checkout-label">Delivery Charge:</span>
                  <span className="unique6-checkout-value">${getTotalAmount().deliveryCharge}</span>
                </div>
                <div className="unique6-order-detail checkout-item total">
                  <span className="unique6-checkout-label">Total:</span>
                  <span className="unique6-checkout-value">${getTotalAmount().totalAmount}</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <a href="/" className="btn btn-primary back-button">
                  Back to Dashboard
                </a>
                {isOrderCancelled && <div className="text-danger">Cancelled Order</div>}
                {!isOrderCancelled && (
                  <button
                    onClick={handleCancelOrder}
                    className="btn btn-danger cancel-order-button"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
