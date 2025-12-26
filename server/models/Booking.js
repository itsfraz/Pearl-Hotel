const mongoose = require('mongoose');

/**
 * Booking Schema
 * Represents room bookings with all details
 */
const bookingSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true // Index for user's bookings queries
    },
    room: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true,
        index: true // Index for room availability queries
    },
    checkIn: { 
        type: Date, 
        required: true,
        index: true // Index for date range queries
    },
    checkOut: { 
        type: Date, 
        required: true,
        index: true // Index for date range queries
    },
    adults: { 
        type: Number, 
        required: true,
        min: 1 
    },
    children: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    youngChildren: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    specialRequests: { 
        type: String,
        trim: true 
    },
    totalPrice: { 
        type: Number, 
        required: true,
        min: 0 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'], 
        default: 'Pending',
        index: true // Index for payment status queries
    },
    paymentId: { type: String }, // Razorpay Payment ID
    orderId: { type: String }, // Razorpay Order ID
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
        default: 'Pending',
        index: true // Index for status filtering
    },
    coupon: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coupon' 
    },
    discountAmount: { 
        type: Number, 
        default: 0,
        min: 0 
    },
}, { 
    timestamps: true,
    // Add compound indexes for common queries
    indexes: [
        { room: 1, checkIn: 1, checkOut: 1, status: 1 }, // For availability checks
        { user: 1, status: 1, createdAt: -1 }, // For user's bookings
        { status: 1, createdAt: -1 } // For admin bookings list
    ]
});

/**
 * Check if booking dates overlap with existing bookings
 * @param {ObjectId} roomId - Room ID
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @param {ObjectId} excludeBookingId - Booking ID to exclude (for updates)
 * @returns {Promise<Boolean>} - True if available, false if conflict
 */
bookingSchema.statics.isRoomAvailable = async function(roomId, checkIn, checkOut, excludeBookingId = null) {
    const query = {
        room: roomId,
        status: { $ne: 'Cancelled' },
        $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
        ]
    };
    
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }
    
    const existingBooking = await this.findOne(query);
    return !existingBooking;
};

module.exports = mongoose.model('Booking', bookingSchema);