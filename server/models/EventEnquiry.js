const mongoose = require('mongoose');

const eventEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  date: { type: String, required: true },
  guestCount: { type: Number, required: true },
  requirements: { type: String },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Confirmed', 'Cancelled'], 
    default: 'New' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional link to registered user
}, { timestamps: true });

module.exports = mongoose.model('EventEnquiry', eventEnquirySchema);
