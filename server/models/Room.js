const mongoose = require('mongoose');

/**
 * Room Schema
 * Represents hotel rooms with all their details
 */
const roomSchema = mongoose.Schema({
    name: { 
        type: String, 
        default: 'Room',
        trim: true 
    },
    type: { 
        type: String, 
        required: true,
        index: true // Index for filtering by type
    },
    roomNumber: { 
        type: String, 
        required: true, 
        unique: true,
        index: true // Index for quick lookups
    },
    price: { 
        type: Number, 
        required: true,
        min: 0,
        index: true // Index for price range queries
    },
    capacity: { 
        type: Number, 
        required: true,
        min: 1,
        index: true // Index for capacity filtering
    },
    description: { 
        type: String, 
        default: '',
        trim: true 
    },
    size: { 
        type: String, 
        default: '400 sq ft' 
    },
    bedType: { 
        type: String, 
        default: '1 Queen Bed' 
    },
    amenities: [{ type: String }],
    features: [{ type: String }],
    images: [{ type: String }],
}, { 
    timestamps: true,
    // Add indexes for common queries
    indexes: [
        { type: 1, price: 1 }, // Compound index for type + price queries
        { capacity: 1, price: 1 } // Compound index for capacity + price queries
    ]
});

// Add text index for search functionality
roomSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Room', roomSchema);