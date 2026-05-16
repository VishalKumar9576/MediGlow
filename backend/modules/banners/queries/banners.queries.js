const pool = require('../../../config/db');

const BannerQueries = {
    getAllBanners: async () => {
        const [rows] = await pool.execute('SELECT * FROM banners');
        return rows;
    },
    getBannersByType: async (type) => {
        const [rows] = await pool.execute('SELECT * FROM banners WHERE type = ?', [type]);
        return rows;
    }
};

module.exports = BannerQueries;
