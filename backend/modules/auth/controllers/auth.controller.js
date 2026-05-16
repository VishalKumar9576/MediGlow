const AuthQueries = require('../queries/auth.queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return errorResponse(res, 'All fields are required', 400);
        }

        const existingUser = await AuthQueries.findUserByEmail(email);
        if (existingUser) {
            return errorResponse(res, 'Email already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await AuthQueries.registerUser(fullName, email, hashedPassword, role);

        return successResponse(res, { userId }, 'User registered successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 'Email and password are required', 400);
        }

        const user = await AuthQueries.findUserByEmail(email);
        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '24h' }
        );

        return successResponse(res, { token, user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role } }, 'Login successful');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await AuthQueries.getUserById(req.user.id);
        return successResponse(res, user, 'Profile fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    register,
    login,
    getProfile
};
