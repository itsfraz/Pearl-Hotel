const express = require('express');
const { createCoupon, validateCoupon, getCoupons, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, admin, createCoupon).get(protect, admin, getCoupons);
router.post('/validate', protect, validateCoupon); // Anyone logged in can validate
router.route('/:id').delete(protect, admin, deleteCoupon);

module.exports = router;
