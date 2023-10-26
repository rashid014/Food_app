// cartModel.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant:{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' } // You can add a user reference if needed
});

module.exports = mongoose.model('Cart', cartSchema);
