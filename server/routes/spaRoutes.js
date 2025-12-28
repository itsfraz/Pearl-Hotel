const express = require('express');
const router = express.Router();
const {
  getServices,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  createBooking,
  getAllBookings
} = require('../controllers/spaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/bookings')
  .post(createBooking)
  .get(protect, admin, getAllBookings);

router.route('/')
  .get(getServices)
  .post(protect, admin, createService);

router.route('/admin').get(protect, admin, getAdminServices);

router.route('/:id')
  .get(getServiceById)
  .put(protect, admin, updateService)
  .delete(protect, admin, deleteService);

module.exports = router;
