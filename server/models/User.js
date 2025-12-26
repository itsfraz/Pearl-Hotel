const mongoose = require('mongoose');

/**
 * User Schema
 * Represents system users (customers and admins)
 */
const userSchema = mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true 
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        index: true // Index for login queries
    },
    password: { 
        type: String, 
        required: true,
        select: false // Don't include password by default
    },
    phone: { 
        type: String,
        trim: true 
    },
    idType: { 
        type: String,
        trim: true 
    },
    idNumber: { 
        type: String,
        trim: true 
    },
    isAdmin: { 
        type: Boolean, 
        default: false,
        index: true // Index for admin queries
    },
}, { 
    timestamps: true 
});

// Compound index for name search
userSchema.index({ firstName: 1, lastName: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);