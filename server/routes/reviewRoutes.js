const express = require('express');
const { createReview, getRoomReviews, getAllReviews, updateReviewStatus } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/room/:roomId').get(getRoomReviews); // Public
router.route('/admin').get(protect, admin, getAllReviews);
router.route('/:id').put(protect, admin, updateReviewStatus);

module.exports = router;
