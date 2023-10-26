const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  restaurantName: String,
  panCard: String,
  gstNumber: String,
  idProof: String,
  fssaiNumber: String,
  bankHolderName: String,  
  bankName: String,        // Add bank name field
  ifsc: String,            // Add IFSC code field
  accountNumber: String ,   // Add account number field
  isApproved: { type: Boolean, default: false }, // Approve field
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
});

const KYC = mongoose.model('KYC', kycSchema);

module.exports = { KYC };
