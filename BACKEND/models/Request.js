const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  receiver: { type: String, required: true },
  organization: { type: String }, // for NGO
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'claimed'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  receiverLocation: { type: Object },
  isNGO: { type: Boolean, default: false }
});

module.exports = mongoose.model('Request', requestSchema); 