const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, checkAvailability, createRoom, updateRoom, deleteRoom, getRoomBookings } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getRooms).post(protect, admin, createRoom);
router.get('/:id/bookings', getRoomBookings);
router.post('/check-availability', checkAvailability);
router.route('/:id').get(getRoomById).put(protect, admin, updateRoom).delete(protect, admin, deleteRoom);

module.exports = router;