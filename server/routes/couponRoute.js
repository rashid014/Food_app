// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Create a new coupon
router.post('/coupons', couponController.createCoupon);

// Delete a coupon by ID
router.patch('/coupons/:id', couponController.deleteCoupon);

router.get('/viewcoupons', couponController.viewAllCoupons);
// Select a coupon for the restaurant
router.post('/selectcoupon', couponController.selectCoupon);

// Deselect a coupon for the restaurant
router.post('/deselectcoupon', couponController.deselectCoupon);

router.get('/coupon/restaurant/:restaurantId', couponController.getAllCouponRestaurants);


module.exports = router;
