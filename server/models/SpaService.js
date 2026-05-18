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
    type: Number, // in minutes (legacy, kept for backward compatibility)
    required: true
  },
  duration_minutes: {
    type: Number, // canonical duration field in minutes
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

// Sync duration_minutes with duration for backward compatibility
spaServiceSchema.pre('save', function(next) {
  if (this.isModified('duration') && !this.isModified('duration_minutes')) {
    this.duration_minutes = this.duration;
  } else if (this.isModified('duration_minutes') && !this.isModified('duration')) {
    this.duration = this.duration_minutes;
  }
  next();
});

module.exports = mongoose.model('SpaService', spaServiceSchema);
