const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'desserts', 'beverages', 'appetizers'],
    lowercase: true
  },
  tag: {
    type: String,
    enum: ['', 'Chef\'s Special', 'Popular', 'Healthy', 'Vegetarian', 'Vegan', 'Premium', 'Spicy', 'New'],
    default: ''
  },
  restaurant: {
    type: String,
    enum: ['The Pearl Restaurant', 'Sky Lounge', 'Pearl Café'],
    default: 'The Pearl Restaurant'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  preparationTime: {
    type: Number, // in minutes
    default: 0
  },
  calories: {
    type: Number,
    default: 0
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ restaurant: 1 });
menuItemSchema.index({ displayOrder: 1 });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

const Menu = mongoose.model('Menu', menuItemSchema);

module.exports = Menu;
