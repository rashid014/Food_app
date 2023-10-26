const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  vehicle: String,
  idProofJpg: String, 
  address: String,
  vehicleNumber: String,
  password: {
    type: String,
    required: true, // Password is required
  },
  confirmPassword: {
    type: String,
    required: true, // Confirm password is required
  },
  isApproved: {
    type: Boolean,
    default: false,
  },

  isPresent: {
    type: Boolean,
    default: true,
  },
  currentDelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
  },
});

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

module.exports = {
  DeliveryPartner,
};
