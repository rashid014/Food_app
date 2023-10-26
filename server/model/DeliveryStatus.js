const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderNumber: String,
  deliveryPartner: mongoose.Schema.Types.ObjectId,
  deliveryStatus: String,
  deliveryDate: Date,
  recipientName: String,
  recipientAddress: String,
  estimatedDeliveryTime: Number,
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner', // Reference to the DeliveryPartner model
  },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
