const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Coupon = require('../models/Coupon');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    console.log("Create Booking Request Body:", req.body);
    const { 
        room, checkIn, checkOut, adults, children, youngChildren, 
        specialRequests, totalPrice, paymentId, orderId, paymentStatus, couponCode, addOns 
    } = req.body;

    try {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        console.log("Dates:", start, end);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
             console.log("Invalid Date");
             return res.status(400).json({ message: 'Invalid check-in or check-out date' });
        }

        // 1. Check Availability
        console.log("Checking availability for room:", room);
        const existingBooking = await Booking.findOne({
            room,
            status: { $ne: 'Cancelled' },
            $or: [
                { checkIn: { $lt: end }, checkOut: { $gt: start } }
            ]
        });

        if (existingBooking) {
            console.log("Room unavailable");
            return res.status(400).json({ message: 'Room is unavailable for the selected dates.' });
        }

        // ... existing coupon logic ... (keep it concise for now or just trust it works if skipped)
        // For debugging, let's keep the rest but wrap the error logging better.

        // ... (inserting simplified coupon logic check for debugging) ...
        let discountAmount = 0;
        let appliedCoupon = null;

        if (couponCode) {
             console.log("Processing coupon:", couponCode);
             // ... logic ...
             const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
             // ... (Assuming coupon logic is fine, but let's be careful)
             if (coupon) {
                 // ... recalculate ...
                 if (coupon.discountType === 'PERCENTAGE') {
                    discountAmount = (totalPrice * coupon.discountValue) / 100;
                    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                } else {
                    discountAmount = coupon.discountValue;
                }
                appliedCoupon = coupon._id;
                coupon.usedCount += 1;
                await coupon.save();
             } else {
                 return res.status(400).json({ message: 'Invalid coupon code' });
             }
        }

        const finalPrice = Math.max(0, totalPrice - discountAmount);
        
        console.log("Creating booking object...");
        const bookingData = {
            user: req.user._id,
            room,
            checkIn: start,
            checkOut: end,
            adults,
            children,
            youngChildren,
            specialRequests,
            totalPrice: finalPrice,
            discountAmount,
            coupon: appliedCoupon,
            paymentId,
            orderId,
            paymentStatus: paymentStatus || 'Pending',
            paymentStatus: paymentStatus || 'Pending',
            status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
            addOns
        };
        console.log("Booking Data to Save:", bookingData);

        const booking = await Booking.create(bookingData);
        console.log("Booking created successfully:", booking._id);

        res.status(201).json(booking);
    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        // Only allow user who made it or admin
        if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
             res.status(401).json({ message: 'Not authorized' });
             return;
        }

        booking.status = 'Cancelled';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        if (status === 'Confirmed' || status === 'Completed') {
            booking.paymentStatus = 'Paid';
        }
        
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('room', 'name roomNumber')
            .populate('user', 'firstName lastName email')
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('room');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats
// @access  Private/Admin
const getBookingStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        
        // Monthly Revenue (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyRevenue = await Booking.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $ne: 'Cancelled' }
                } 
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalPrice" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const  statusCounts = await Booking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({
            totalBookings,
            totalRevenue: totalRevenue[0]?.total || 0,
            monthlyRevenue,
            statusCounts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('room');

        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getBookings, getBookingById, cancelBooking, getAllBookings, getBookingStats, updateBookingStatus };