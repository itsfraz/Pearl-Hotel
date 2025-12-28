const mongoose = require('mongoose');

const spaServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    // enum: ['Massage', 'Therapy', 'Sauna', 'Yoga', 'Facial', 'Wellness'], // Optional: strict categories
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SpaService', spaServiceSchema);
