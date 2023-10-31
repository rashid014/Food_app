const express = require('express');
const router = express.Router();
const cartControllers = require('../controllers/cartControllers');

// Define routes
router.get('/cart', cartControllers.getAllCartItems);
router.post('/cart/add', cartControllers.addToCart);
router.post('/cart/removeitem', cartControllers.removeFromCart);
router.post('/cart/removeall', cartControllers.removeItem);
router.post('/cart/update', cartControllers.updateCartItemQuantity);
router.get('/orders/:orderId', cartControllers.getOrderDetails);
router.put('/orders/:orderId', cartControllers.cancelOrder);
router.post('/orders/deletemany',cartControllers.removeEntireItems)

module.exports = router;
