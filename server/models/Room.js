const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: { type: String, default: 'Room' },
    type: { type: String, required: true },
    roomNumber: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    description: { type: String, default: '' },
    size: { type: String, default: '400 sq ft' },
    bedType: { type: String, default: '1 Queen Bed' },
    amenities: [{ type: String }],
    features: [{ type: String }],
    images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);