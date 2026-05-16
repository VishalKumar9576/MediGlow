const pool = require('../../../config/db');

const HistoryQueries = {
    getUserHistory: async (userId) => {
        const [rows] = await pool.execute(`
            SELECT h.*, o.total_amount, o.status, o.created_at as order_date
            FROM order_history h
            JOIN orders o ON h.order_id = o.id
            WHERE h.user_id = ?
            ORDER BY h.created_at DESC
        `, [userId]);
        return rows;
    },

    deleteHistoryEntry: async (historyId, userId) => {
        await pool.execute('DELETE FROM order_history WHERE id = ? AND user_id = ?', [historyId, userId]);
    }
};

module.exports = HistoryQueries;
