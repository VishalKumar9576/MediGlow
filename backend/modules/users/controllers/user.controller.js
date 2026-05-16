const UserQueries = require('../queries/user.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

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

module.exports = {
    getCustomers,
    getCustomerStats
};
