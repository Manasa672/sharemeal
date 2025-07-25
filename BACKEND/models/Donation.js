const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: String, required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  foodDescription: { type: String, required: true },
  bestBefore: { type: Date, required: true },
  preferredPickup: { type: String },
  specialInstructions: { type: String },
  location: { type: Object, required: true },
  status: { type: String, enum: ['available', 'requested', 'accepted', 'claimed', 'expired'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

donationSchema.index({ donor: 1 });

module.exports = mongoose.model('Donation', donationSchema); 