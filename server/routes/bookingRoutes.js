const express = require('express');
const { createBooking, getBookings, getBookingById, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getBookings);
router.route('/admin').get(protect, admin, getAllBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/cancel').put(protect, cancelBooking);

module.exports = router;