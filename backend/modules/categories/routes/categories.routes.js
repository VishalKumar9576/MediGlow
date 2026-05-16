const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

router.get('/', categoriesController.getAllCategories);
router.post('/', authMiddleware, isAdmin, categoriesController.addCategory);
router.put('/:id', authMiddleware, isAdmin, categoriesController.updateCategory);
router.delete('/:id', authMiddleware, isAdmin, categoriesController.deleteCategory);

module.exports = router;
