const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'interchange.proxy.rlwy.net',
    user: 'root',
    password: 'VkhxxHYBJLoQLPyVPrtlzgOLWPwfHLud',
    database: 'railway',
    port: 45210,
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