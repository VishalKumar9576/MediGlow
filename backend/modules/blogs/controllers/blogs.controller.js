const BlogQueries = require('../queries/blogs.queries');
const { successResponse, errorResponse } = require('../../../shared/response.utils');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogQueries.getAllBlogs();
        return successResponse(res, blogs, 'Blogs fetched successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, category, status, image_url, author, tags } = req.body;
        
        if (!title || !content) {
            return errorResponse(res, 'Title and content are required', 400);
        }

        // Generate slug from title
        let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        // Ensure slug uniqueness
        let existingBlog = await BlogQueries.findBlogBySlug(slug);
        let count = 1;
        let originalSlug = slug;
        while (existingBlog) {
            slug = `${originalSlug}-${count}`;
            existingBlog = await BlogQueries.findBlogBySlug(slug);
            count++;
        }

        const blogData = {
            title,
            slug,
            excerpt: excerpt || content.substring(0, 150) + '...',
            content,
            category: category || 'General',
            status: status || 'draft',
            image_url,
            author: author || 'Admin',
            tags: tags || []
        };

        const blogId = await BlogQueries.createBlog(blogData);
        return successResponse(res, { id: blogId, slug }, 'Blog post created successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blogData = req.body;
        
        const success = await BlogQueries.updateBlog(id, blogData);
        if (!success) {
            return errorResponse(res, 'Blog post not found', 404);
        }
        
        return successResponse(res, null, 'Blog post updated successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await BlogQueries.deleteBlog(id);
        if (!success) {
            return errorResponse(res, 'Blog post not found', 404);
        }
        
        return successResponse(res, null, 'Blog post deleted successfully');
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

module.exports = {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog
};
