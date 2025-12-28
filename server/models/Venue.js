const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  capacityMin: { type: Number, required: true },
  capacityMax: { type: Number, required: true },
  area: { type: Number }, // sq ft
  price: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }], // e.g., "AC", "WiFi", "Projector"
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
