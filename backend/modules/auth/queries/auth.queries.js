const pool = require('../../../config/db');

const AuthQueries = {
    registerUser: async (fullName, email, hashedPassword, role = 'user') => {
        const [result] = await pool.execute(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, role]
        );
        return result.insertId;
    },

    findUserByEmail: async (email) => {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    getUserById: async (id) => {
        const [rows] = await pool.execute(
            'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
};

module.exports = AuthQueries;
