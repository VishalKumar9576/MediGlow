const pool = require('../../../config/db');

const CategoryQueries = {
    getAllCategories: async () => {
        const [rows] = await pool.execute(`
            SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as products 
            FROM categories c
        `);
        return rows;
    },

    createCategory: async (categoryData) => {
        const { title, image, color, description } = categoryData;
        const [result] = await pool.execute(
            'INSERT INTO categories (title, image, color, description) VALUES (?, ?, ?, ?)',
            [title, image, color || '#3b82f6', description || '']
        );
        return result.insertId;
    },

    updateCategory: async (id, categoryData) => {
        const { title, image, color, description } = categoryData;
        const [result] = await pool.execute(
            'UPDATE categories SET title = ?, image = ?, color = ?, description = ? WHERE id = ?',
            [title, image, color, description, id]
        );
        return result.affectedRows > 0;
    },

    deleteCategory: async (id) => {
        const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

const BrandQueries = {
    getAllBrands: async () => {
        const [rows] = await pool.execute('SELECT * FROM brands');
        return rows;
    },

    createBrand: async (brandData) => {
        const { name, image, active, featured } = brandData;
        const [result] = await pool.execute(
            'INSERT INTO brands (name, image, active, featured) VALUES (?, ?, ?, ?)',
            [name, image, active !== false ? 1 : 0, featured ? 1 : 0]
        );
        return result.insertId;
    },

    updateBrand: async (id, brandData) => {
        const { name, image, active, featured } = brandData;
        const [result] = await pool.execute(
            'UPDATE brands SET name = ?, image = ?, active = ?, featured = ? WHERE id = ?',
            [name, image, active ? 1 : 0, featured ? 1 : 0, id]
        );
        return result.affectedRows > 0;
    },

    deleteBrand: async (id) => {
        const [result] = await pool.execute('DELETE FROM brands WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = {
    CategoryQueries,
    BrandQueries
};
