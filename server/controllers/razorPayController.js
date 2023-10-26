// Import the Razorpay SDK
const Razorpay = require('razorpay');

// Initialize the Razorpay instance with your API key and API secret
const razorpay = new Razorpay({
    key_id: 'rzp_test_nh5fggxaOrm0X4',
    key_secret: 'iJMtpdU3QquCIcl0h6jie5D1',
  });

// Controller to create a Razorpay order
exports.createRazorpayOrder = async (totalAmount) => {
    try {
      const options = {
        amount: totalAmount * 100, // Amount should be in paise (multiply by 100)
        currency: 'INR', // Change this to your currency code if needed
        receipt: 'order_rcptid_11', // You can generate a unique receipt ID
        payment_capture: 1, // Auto-capture the payment
      };
  
      const order = await instance.orders.create(options);
      return order;
    } catch (error) {
      throw error;
    }
  };
