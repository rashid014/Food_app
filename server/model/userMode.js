const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  image: { type: String },
  cart: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: { type: Number, default: 1 }, // You can add other item-related information here
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Reference to orders
},
{ collection: 'users' });

module.exports = mongoose.model('User', userSchema);
