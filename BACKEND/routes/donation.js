const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Create a new donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donations by donor username
router.get('/user/:donor', async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.params.donor });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update donation
router.put('/:id', async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete donation
router.delete('/:id', async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json({ message: 'Donation deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 