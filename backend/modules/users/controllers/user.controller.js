const UserQueries = require('../queries/user.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');
const bcrypt = require('bcryptjs');

const getCustomers = async (req, res) => {
    try {
        const customers = await UserQueries.getCustomers();
        
        // Add dynamic segmentation logic
        const segmentedCustomers = customers.map(c => {
            let segment = 'Regular';
            if (c.totalSpent > 1000) {
                segment = 'VIP';
            } else if (c.totalOrders <= 1) {
                segment = 'New';
            }
            
            return {
                ...c,
                segment,
                lastOrder: c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'N/A'
            };
        });

        return successResponse(res, segmentedCustomers, 'Customers fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const getCustomerStats = async (req, res) => {
    try {
        const stats = await UserQueries.getCustomerStats();
        return successResponse(res, stats, 'Customer stats fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const createCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone, city } = req.body;
        if (!fullName || !email) {
            return errorResponse(res, 'Name and Email are required', 400);
        }

        const defaultPassword = password || 'User@1234';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const insertId = await UserQueries.createUser({
            fullName,
            email,
            password: hashedPassword,
            phone,
            city
        });

        return successResponse(res, { id: insertId }, 'Customer created successfully', 201);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return errorResponse(res, 'Email address already exists', 400);
        }
        return errorResponse(res, err.message);
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await UserQueries.updateUser(id, req.body);
        if (!success) {
            return errorResponse(res, 'Customer not found or no changes made', 404);
        }
        return successResponse(res, null, 'Customer updated successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await UserQueries.deleteUser(id);
        if (!success) {
            return errorResponse(res, 'Customer not found', 404);
        }
        return successResponse(res, null, 'Customer deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getCustomers,
    getCustomerStats,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
