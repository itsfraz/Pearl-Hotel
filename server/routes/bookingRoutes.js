const express = require('express');
const { createBooking, getBookings, getBookingById, cancelBooking, getAllBookings, getBookingStats, updateBookingStatus } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getBookings);
router.route('/admin').get(protect, admin, getAllBookings);
router.route('/stats').get(protect, admin, getBookingStats);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/cancel').put(protect, cancelBooking);
router.route('/:id/status').put(protect, admin, updateBookingStatus);

module.exports = router;