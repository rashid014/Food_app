// itemModel.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  typeOfMeal: String, // Type of meal (e.g., breakfast, lunch, dinner)
  timeAvailable: String, // Time available (e.g., morning, afternoon, evening)
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

module.exports = mongoose.model('Item', itemSchema);
