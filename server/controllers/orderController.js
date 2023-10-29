// orderController.js

const Order = require('../model/Order'); // Import your order model
const geocoder = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxClient = geocoder({ accessToken: 'pk.eyJ1IjoicmFzaGlkMDAxNCIsImEiOiJjbG80OWd6dnowYjdjMmpwMDVmM3FwcHltIn0.QbxE40btQ7RKkBDqdANVDw'});

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

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { restaurantId } = req.query;

    // Replace the following with your actual logic to fetch order details
    // from your database or another data source.
    const orderDetails = await fetchOrderDetailsFromDatabase(orderId, restaurantId);

    // Geocode restaurant and user addresses
    const restaurantLocation = await geocodeAddress(orderDetails.restaurantAddress);
    const userLocation = await geocodeAddress(orderDetails.deliveryAddress);

    // You can customize the response structure as needed.
    const response = {
      ...orderDetails,
      restaurantLocation,
      userLocation,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to fetch order details (replace with your database logic)
async function fetchOrderDetailsFromDatabase(orderId, restaurantId) {
  // Replace this with your actual database query logic
  return {
    orderId,
    restaurantId,
    // Other order details...
  };
}

// Function to geocode an address using Mapbox Geocoding API
async function geocodeAddress(address) {
  const response = await mapboxClient.geocodeForward({ query: address }).send();
  if (response && response.body && response.body.features && response.body.features.length > 0) {
    const firstFeature = response.body.features[0];
    return {
      latitude: firstFeature.center[1],
      longitude: firstFeature.center[0],
    };
  } else {
    return null; // Handle geocoding error
  }
};

