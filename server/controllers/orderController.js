// orderController.js

const Order = require('../model/Order'); // Import your order model

exports.getAllOrders = async (req, res) => {
  const { restaurantId } = req.query;
 console.log("res"+restaurantId)
  try {
    const orders = await Order.find({ restaurantId }); // Find orders with matching restaurantId
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Controller function to update the order status
exports.updateOrderStatus = (req, res) => {
  const orderId = req.body.orderId;

  // Use Mongoose to find and update the order
  Order.findByIdAndUpdate(orderId, { status: 'Confirmed' }, (err, order) => {
    if (err) {
      // Handle the error
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Order status updated successfully
    return res.status(200).json({ message: 'Order status updated to Confirmed' });
  });
};

exports. rejectOrder = (req, res) => {
  const orderId = req.body.orderId;

  // Use Mongoose to find and update the order status to "Rejected"
  Order.findByIdAndUpdate(orderId, { status: 'Rejected' }, (err, order) => {
    if (err) {
      // Handle the error
      return res.status(500).json({ error: 'Failed to reject the order' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Order status updated to "Rejected"
    return res.status(200).json({ message: 'Order status updated to Rejected' });
  });
};

