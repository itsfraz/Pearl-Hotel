const express = require('express');
const { registerUser, loginUser, getMe, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', protect, getMe);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;