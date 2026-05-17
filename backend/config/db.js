const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'interchange.proxy.rlwy.net',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'VkhxxHYBJLoQLPyVPrtlzgOLWPwfHLud',
    database: process.env.DB_NAME || 'railway',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 45210,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully.');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection failed!', err);
    }
})();

module.exports = pool;