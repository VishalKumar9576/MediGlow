const pool = require('../../../config/db');

const UserQueries = {
    getCustomers: async () => {
        const [rows] = await pool.query(`
            SELECT 
                u.id, 
                u.full_name as name, 
                u.email, 
                u.phone, 
                u.city, 
                LEFT(u.full_name, 1) as initial,
                COUNT(o.id) as totalOrders,
                IFNULL(SUM(CASE WHEN o.status != 'cancelled' THEN o.total_amount ELSE 0 END), 0) as totalSpent,
                MAX(o.created_at) as lastOrder,
                u.created_at as joinDate
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role = 'user'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        return rows;
    },

    getCustomerStats: async () => {
        // Total Customers
        const [totalRes] = await pool.query("SELECT COUNT(*) as totalCustomers FROM users WHERE role = 'user'");
        
        // New This Month
        const [newRes] = await pool.query(`
            SELECT COUNT(*) as newThisMonth 
            FROM users 
            WHERE role = 'user' 
            AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `);

        // Returning Customers (users with > 1 order)
        const [returningRes] = await pool.query(`
            SELECT COUNT(*) as returningCustomers FROM (
                SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(id) > 1
            ) as t
        `);

        // Avg Order Value
        const [avgRes] = await pool.query("SELECT AVG(total_amount) as avgOrderValue FROM orders WHERE status != 'cancelled'");

        return {
            totalCustomers: totalRes[0].totalCustomers,
            newThisMonth: newRes[0].newThisMonth,
            returningCustomers: returningRes[0].returningCustomers,
            avgOrderValue: Math.round(avgRes[0].avgOrderValue || 0)
        };
    }
};

module.exports = UserQueries;
