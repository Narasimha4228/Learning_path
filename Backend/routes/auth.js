const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Navigation paths by role
const ROLE_REDIRECTS = {
    student: './home.html',
    instructor: './instructor/dashboard.html',
    admin: './admin/dashboard.html'
};

// Error response helper
const errorResponse = (message, statusCode = 400, errorCode = 'AUTH_ERROR') => ({
    success: false,
    message,
    errorCode
});

// Update registration endpoint with better validation
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, password, role, department, position } = req.body;

        // Enhanced validation
        if (!full_name || !email || !password || !role) {
            return res.status(400).json(
                errorResponse('All required fields must be filled', 400, 'VALIDATION_ERROR')
            );
        }

        // Validate role
        const validRoles = ['student', 'instructor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json(
                errorResponse('Invalid role specified', 400, 'INVALID_ROLE')
            );
        }

        // Additional validation for instructor role
        if (role === 'instructor' && (!department || !position)) {
            return res.status(400).json(
                errorResponse('Department and position are required for instructors', 400, 'MISSING_INSTRUCTOR_FIELDS')
            );
        }

        // Check if user already exists with case-insensitive email
        const existingUser = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') } 
        });

        if (existingUser) {
            return res.status(409).json(
                errorResponse('Email already registered', 409, 'EMAIL_EXISTS')
            );
        }

        // Create user object with base fields
        const userData = {
            full_name,
            email: email.toLowerCase(),
            password: await bcrypt.hash(password, 10),
            role
        };

        // Add instructor specific fields if applicable
        if (role === 'instructor') {
            userData.department = department;
            userData.position = position;
        }

        // Create new user
        const newUser = await User.create(userData);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login.',
            redirect: '/login.html'
        });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(409).json(
                errorResponse('Email already registered', 409, 'EMAIL_EXISTS')
            );
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json(
                errorResponse(
                    Object.values(error.errors).map(err => err.message).join(', '),
                    400,
                    'VALIDATION_ERROR'
                )
            );
        }

        res.status(500).json(
            errorResponse('Registration failed', 500, 'SERVER_ERROR')
        );
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json(
                errorResponse('Email and password are required', 400, 'VALIDATION_ERROR')
            );
        }

        // Find user with case-insensitive email
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        }).select('+password'); // Explicitly include password field

        if (!user) {
            return res.status(401).json(
                errorResponse('Invalid credentials', 401, 'INVALID_CREDENTIALS')
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(
                errorResponse('Invalid credentials', 401, 'INVALID_CREDENTIALS')
            );
        }

        // Update last login with atomic operation
        await User.updateOne(
            { _id: user._id },
            { 
                $set: { last_login: new Date() },
                $inc: { login_count: 1 }
            }
        );

        // Generate token with user data
        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send success response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                fullName: user.full_name,
                lastLogin: user.last_login
            },
            redirect: ROLE_REDIRECTS[user.role] || './home.html'
        });

    } catch (error) {
        console.error('Login error:', error);

        // Handle specific MongoDB errors
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return res.status(500).json(
                errorResponse('Database error', 500, 'DB_ERROR')
            );
        }

        res.status(500).json(
            errorResponse('Login failed', 500, 'SERVER_ERROR')
        );
    }
});

// ...existing code...

module.exports = router;