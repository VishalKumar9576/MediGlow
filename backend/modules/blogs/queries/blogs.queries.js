const pool = require('../../../config/db');

const BlogQueries = {
    getAllBlogs: async () => {
        const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        return rows;
    },

    getBlogById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
        return rows[0];
    },

    createBlog: async (blogData) => {
        const { title, slug, excerpt, content, category, status, image_url, author, tags } = blogData;
        const [result] = await pool.query(`
            INSERT INTO blogs (title, slug, excerpt, content, category, status, image_url, author, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [title, slug, excerpt, content, category, status, image_url, author, JSON.stringify(tags || [])]);
        return result.insertId;
    },

    updateBlog: async (id, blogData) => {
        const { title, excerpt, content, category, status, image_url, author, tags } = blogData;
        const [result] = await pool.query(`
            UPDATE blogs 
            SET title = ?, excerpt = ?, content = ?, category = ?, status = ?, image_url = ?, author = ?, tags = ?
            WHERE id = ?
        `, [title, excerpt, content, category, status, image_url, author, JSON.stringify(tags || []), id]);
        return result.affectedRows > 0;
    },

    deleteBlog: async (id) => {
        const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    findBlogBySlug: async (slug) => {
        const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
        return rows[0];
    }
};

module.exports = BlogQueries;
