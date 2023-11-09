// routes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// const deliveryPartnerController = require('./controllers/deliveryPartnerController');

// Order Management Routes
router.get('/restaurant/orders', orderController.getAllOrders);
router.post('/api/restaurant/update-order-status', orderController.updateOrderStatus);
router.post('/restaurant/accept-order', orderController.updateOrderStatus);
router.post('/restaurant/reject-order', orderController.rejectOrder);
router.get('/orders/:orderId', orderController.getOrderDetails);
router.get('/restaurantorders/orders', orderController.getUserOrderDetails);
router.get('/restaurant/orders/admin', orderController.getAllAdminOrders);

// router.post('/api/restaurant/send-request', deliveryPartnerController.sendRequestToDeliveryPartners);

// // Delivery Partner Routes
// router.get('/api/restaurant/delivery-partners', deliveryPartnerController.getAllDeliveryPartners);

module.exports = router;
