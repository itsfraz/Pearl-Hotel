const mongoose = require('mongoose');

const cateringMenuSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Royal Indian Buffet"
  cuisine: { type: String, required: true }, // e.g. "North Indian", "Continental"
  description: { type: String },
  menuItems: [{
    name: { type: String },
    type: { type: String, enum: ['Veg', 'Non-Veg', 'Vegan', 'Jain', 'Halal'] },
    price: { type: Number }
  }],
  pricePerPlate: { type: Number },
  pdfUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CateringMenu', cateringMenuSchema);
