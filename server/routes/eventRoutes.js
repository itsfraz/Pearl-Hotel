const express = require('express');
const router = express.Router();
const {
  getEventStats,
  getVenues, getAdminVenues, createVenue, updateVenue, deleteVenue,
  getPackages, getAdminPackages, createPackage, updatePackage, deletePackage,
  getEventTypes, getAdminEventTypes, createEventType, updateEventType, deleteEventType,
  getCatering, getAdminCatering, createCatering, updateCatering, deleteCatering,
  createEnquiry, getEnquiries, updateEnquiryStatus
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/venues', getVenues);
router.get('/packages', getPackages);
router.get('/event-types', getEventTypes);
router.get('/catering', getCatering);
router.post('/enquiries', createEnquiry);

// Admin Routes - Stats
router.get('/stats', protect, admin, getEventStats);

// Admin Routes - Venues
router.get('/venues/admin', protect, admin, getAdminVenues);
router.post('/venues', protect, admin, createVenue);
router.put('/venues/:id', protect, admin, updateVenue);
router.delete('/venues/:id', protect, admin, deleteVenue);

// Admin Routes - Packages
router.get('/packages/admin', protect, admin, getAdminPackages);
router.post('/packages', protect, admin, createPackage);
router.put('/packages/:id', protect, admin, updatePackage);
router.delete('/packages/:id', protect, admin, deletePackage);

// Admin Routes - Event Types
router.get('/event-types/admin', protect, admin, getAdminEventTypes);
router.post('/event-types', protect, admin, createEventType);
router.put('/event-types/:id', protect, admin, updateEventType);
router.delete('/event-types/:id', protect, admin, deleteEventType);

// Admin Routes - Catering
router.get('/catering/admin', protect, admin, getAdminCatering);
router.post('/catering', protect, admin, createCatering);
router.put('/catering/:id', protect, admin, updateCatering);
router.delete('/catering/:id', protect, admin, deleteCatering);

// Admin Routes - Enquiries
router.get('/enquiries', protect, admin, getEnquiries);
router.put('/enquiries/:id', protect, admin, updateEnquiryStatus);

module.exports = router;
