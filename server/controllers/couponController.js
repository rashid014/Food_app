// controllers/couponController.js
const Coupon = require('../model/Coupon');
const Restaurant = require('../model/Restaurant');

exports.viewAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find({ deleted: false }); // Only retrieve coupons with deleted status as false
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve coupons' });
    }
  };
  
  
// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { name, percentage, expiryDate } = req.body;
    const coupon = new Coupon({ name, percentage, expiryDate });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Coupon creation failed' });
  }
};


// Delete a coupon by ID
// controllers/couponController.js
exports.deleteCoupon = async (req, res) => {
    try {
      const couponId = req.params.id
      console.log("coupon"+couponId)
      // Find the coupon by ID
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
  
      // Perform a soft delete by marking the coupon as deleted and setting deletedAt timestamp
      coupon.deleted = true;
      coupon.deletedAt = new Date();
      await coupon.save();
  
      res.status(204).json(); // Return success response
    } catch (error) {
      res.status(500).json({ error: 'Coupon soft deletion failed' });
    }
  };
  
  exports.selectCoupon = async (req, res) => {
    try {
      const { couponId } = req.body;
      const { restaurantId } = req.body;
  
      const restaurant = await Restaurant.findById(restaurantId);
  
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      const coupon = await Coupon.findById(couponId);
  
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      const selectedCoupon = coupon.selectedCoupons.find((sc) => sc.Restaurant.equals(restaurantId));
  
     
  
      // Push the restaurantId and isSelected into the selectedCoupons array
      coupon.selectedCoupons.push({ Restaurant: restaurantId, isSelected: true });
      await coupon.save();
  
      res.status(200).json({ message: 'Coupon selected successfully', isSelected: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
// Deselect a coupon for the restaurant
exports.deselectCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const { restaurantId } = req.body; // Assuming you have user authentication and can get the restaurant's ID from the user

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const selectedCoupon = restaurant.selectedCoupons.find((coupon) => coupon.coupon.equals(couponId));

    if (!selectedCoupon) {
      return res.status(404).json({ error: 'Coupon not found in selectedCoupons' });
    }

    // Set isSelected to false for the selected coupon
    selectedCoupon.isSelected = false;

    await restaurant.save();

    res.status(200).json({ message: 'Coupon deselected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



  exports.getAllCouponRestaurants = async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId; // Get restaurantId from the request parameters
     
      
      const restaurantData = await Restaurant.findOne({ _id: restaurantId }); // Find the specific restaurant by its ID
  
      if (!restaurantData) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      // Access the isSelected values for all coupons
      const isSelectedValues = restaurantData.selectedCoupons.map((coupon) => coupon.isSelected);
      
      res.json({ restaurantData, isSelected: isSelectedValues });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  