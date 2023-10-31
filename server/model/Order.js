const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  contactNumber: String,
  deliveryAddress: String,
  restaurantName: String,
  deliveryCharge: Number,
  tax: Number,
  totalAmount: Number,
  subtotal: Number,
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Delivery Partner Assigned', 'Order Picked Up', 'On the Way', 'Delivered', 'Not Delivered'],
    default: 'Pending',
  },
  assignedDeliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    default: null, // Initially not assigned to any partner
  },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cart: [
    {
      itemName: String,
      price: Number,
      quantity: Number,
      amount: Number
    }
  ],
  paymentStatus: {
    type: String,
    enum: ['paid', 'not paid', null], // Options for payment status
    default: null, // Initially set to null
  },
  partnerPayment: {
    type: String,
    enum: ['Payment Approved', 'Payment Not Approved', null],
    default: null,
  },
  restaurantPayment: {
    type: String,
    enum: ['Payment Approved', 'Payment Not Approved', null],
    default: null,
  },
  isPresent: { type: Boolean, default: true },
}, { collection: 'orders' });

module.exports = mongoose.model('Order', orderSchema);
