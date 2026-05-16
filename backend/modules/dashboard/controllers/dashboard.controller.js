const DashboardQueries = require('../queries/dashboard.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');
const fs = require('fs');
const path = require('path');

const getDashboardStats = async (req, res) => {
    try {
        const stats = await DashboardQueries.getStats();
        const recentOrders = await DashboardQueries.getRecentOrders();
        const topProducts = await DashboardQueries.getTopProducts();

        return successResponse(res, {
            ...stats,
            recentOrders,
            topProducts
        }, 'Dashboard stats fetched successfully');
    } catch (err) {
        fs.appendFileSync(path.join(__dirname, '../../../../dashboard_errors.log'), `${new Date().toISOString()} - ERROR: ${err.message}\n${err.stack}\n\n`);
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getDashboardStats
};
