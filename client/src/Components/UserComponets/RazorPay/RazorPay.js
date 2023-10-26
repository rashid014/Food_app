import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Razorpay from 'react-razorpay';

function CreateRazorpayOrder() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  // Create a Razorpay order
  const createRazorpayOrder = async () => {
    try {
      // Make an API request to your backend to create a Razorpay order
      const response = await fetch('http://localhost:4000/api/razor', {
        method: 'POST',
      });
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
    }
  };

  const handlePaymentSuccess = (response) => {
    // Handle a successful payment
    console.log('Payment success:', response);
    navigate('/ordersuccess'); // Navigate to the success page
  };

  return (
    <div>
      {/* Button to trigger payment */}
      <button onClick={createRazorpayOrder}>Pay with Razorpay</button>

      {order && (
        <Razorpay
          order_id={order.id}
          amount={order.amount}
          currency={order.currency}
          name="Your Company Name"
          description="Payment for your order"
          image="https://your-company-logo.png"
          handler={handlePaymentSuccess}
        >
          <button>Pay Now</button>
        </Razorpay>
      )}
    </div>
  );
}

export default CreateRazorpayOrder;
