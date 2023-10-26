const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: String,
  email: String,
  password: String, 
  restaurantAddress: String, 
  restaurantImageFile: String, 
  isBlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
