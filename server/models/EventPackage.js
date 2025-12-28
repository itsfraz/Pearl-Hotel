const mongoose = require('mongoose');

const eventPackageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Silver", "Gold"
  type: { type: String, required: true }, // e.g. "Wedding", "Corporate"
  pricePerPerson: { type: Number, required: true },
  inclusions: [{ type: String }], // List of features
  description: { type: String },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EventPackage', eventPackageSchema);
