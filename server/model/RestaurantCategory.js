// categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String, // Store the file path or URL to the uploaded image
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

module.exports = mongoose.model('Category', categorySchema);

