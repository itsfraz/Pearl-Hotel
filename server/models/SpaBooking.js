const mongoose = require('mongoose');

const spaBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be guest booking
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpaService',
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  guestEmail: {
    type: String,
    required: true
  },
  date: {
    type: String, // Storing as 'YYYY-MM-DD' for simplicity
    required: true
  },
  time: {
    type: String, // 'HH:MM'
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist', // We haven't created this yet, but good to have ready
    required: false
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SpaBooking', spaBookingSchema);
