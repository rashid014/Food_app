// models/coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  // ... other fields ...
  name: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  selectedCoupons: [
    {
      Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      isSelected: Boolean,
    },
  ],
});

module.exports = mongoose.model('Coupon', couponSchema);
