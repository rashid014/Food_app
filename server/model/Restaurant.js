const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: String,
  email: String,
  password: String,
  restaurantAddress: String,
  restaurantImageFile: String,
  isBlocked: { type: Boolean, default: false },
  selectedCoupons: [
    {
      coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
      isSelected: Boolean, // Indicates if the coupon is selected or not
    },
  ],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
