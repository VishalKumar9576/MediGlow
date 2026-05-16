const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogs.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

router.get('/', blogsController.getAllBlogs);
router.post('/', authMiddleware, isAdmin, blogsController.createBlog);
router.put('/:id', authMiddleware, isAdmin, blogsController.updateBlog);
router.delete('/:id', authMiddleware, isAdmin, blogsController.deleteBlog);

module.exports = router;
