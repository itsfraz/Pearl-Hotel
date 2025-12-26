const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Input Validation Helper
 * Validates and sanitizes user input
 */
const validateInput = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    password: (password) => {
        // Minimum 6 characters, at least one letter and one number
        return password && password.length >= 6;
    },
    name: (name) => {
        return name && name.trim().length >= 2 && name.trim().length <= 50;
    },
    phone: (phone) => {
        if (!phone) return true; // Optional field
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

/**
 * Sanitize user input
 * Remove potentially dangerous characters
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, idType, idNumber } = req.body;

        // Input validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!validateInput.email(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!validateInput.password(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        if (!validateInput.name(firstName) || !validateInput.name(lastName)) {
            return res.status(400).json({ message: 'Invalid name format' });
        }

        if (phone && !validateInput.phone(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Sanitize inputs
        const sanitizedData = {
            firstName: sanitizeInput(firstName),
            lastName: sanitizeInput(lastName),
            email: sanitizeInput(email.toLowerCase()),
            phone: phone ? sanitizeInput(phone) : undefined,
            idType: idType ? sanitizeInput(idType) : undefined,
            idNumber: idNumber ? sanitizeInput(idNumber) : undefined
        };

        // Check if user exists
        const userExists = await User.findOne({ email: sanitizedData.email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password with bcrypt (10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            ...sanitizedData,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        if (!validateInput.email(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Sanitize email
        const sanitizedEmail = sanitizeInput(email.toLowerCase());

        // Find user and explicitly select password
        const user = await User.findOne({ email: sanitizedEmail }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Return user data with token
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            idType: user.idType,
            idNumber: user.idNumber,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error fetching user data' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort('-createdAt');
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { isAdmin } = req.body;

        // Validate input
        if (typeof isAdmin !== 'boolean') {
            return res.status(400).json({ message: 'Invalid role value' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent self-demotion
        if (req.user._id.toString() === user._id.toString() && !isAdmin) {
            return res.status(400).json({ message: 'Cannot remove your own admin rights' });
        }

        user.isAdmin = isAdmin;
        await user.save();

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'Server error updating user role' });
    }
};

/**
 * Generate JWT Token
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

module.exports = { 
    registerUser, 
    loginUser, 
    getMe, 
    getAllUsers, 
    updateUserRole 
};