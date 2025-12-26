const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { room, rating, comment } = req.body;

    try {
        // Verify user booked the room and status is Completed or CheckedOut (assuming 'Confirmed' for now or add logic)
        // Ideally checking if user stayed there.
        const booking = await Booking.findOne({ 
            user: req.user._id, 
            room: room, 
            status: { $in: ['Confirmed', 'Completed'] } 
        });

        if (!booking) {
            return res.status(400).json({ message: 'You can only review rooms you have booked.' });
        }

        const review = await Review.create({
            user: req.user._id,
            room,
            rating,
            comment,
            isApproved: false // Requires admin approval
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get reviews for a room
// @route   GET /api/reviews/:roomId
// @access  Public
const getRoomReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ room: req.params.roomId, isApproved: true })
            .populate('user', 'firstName lastName')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'firstName lastName email')
            .populate('room', 'name')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            review.isApproved = req.body.isApproved;
            await review.save();
            res.json(review);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getRoomReviews, getAllReviews, updateReviewStatus };
