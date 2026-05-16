const pool = require('../../../config/db');

const DashboardQueries = {
    getStats: async () => {
        // Total Revenue (from completed/delivered orders)
        const [revenueRes] = await pool.query(`
            SELECT SUM(total_amount) as totalRevenue 
            FROM orders 
            WHERE status IN ('completed', 'delivered', 'pending')
        `);

        // Total Orders
        const [ordersRes] = await pool.query('SELECT COUNT(*) as totalOrders FROM orders');

        // Total Products
        const [productsRes] = await pool.query('SELECT COUNT(*) as totalProducts FROM products');

        // Active Customers
        const [customersRes] = await pool.query("SELECT COUNT(*) as activeCustomers FROM users WHERE role = 'user'");

        return {
            totalRevenue: `₹${(revenueRes[0].totalRevenue || 0).toLocaleString()}`,
            revenueGrowth: '+12.5%', // Mock growth for now
            totalOrders: ordersRes[0].totalOrders.toString(),
            totalProducts: productsRes[0].totalProducts.toString(),
            activeCustomers: customersRes[0].activeCustomers.toString(),
        };
    },

    getRecentOrders: async (limit = 10) => {
        const [rows] = await pool.query(`
            SELECT o.id, u.full_name as customer_name, o.status, o.total_amount, o.created_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT ?
        `, [limit]);
        return rows;
    },

    getTopProducts: async (limit = 5) => {
        const [rows] = await pool.query(`
            SELECT p.id, p.name, p.price, 
                   (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image,
                   COUNT(oi.product_id) as sales_count
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id, p.name, p.price
            ORDER BY sales_count DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }
};

module.exports = DashboardQueries;
