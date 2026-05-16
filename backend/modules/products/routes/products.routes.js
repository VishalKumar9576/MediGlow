const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

router.get('/', productsController.getAllProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/:slug', productsController.getProductBySlug);
router.post('/', authMiddleware, isAdmin, productsController.addProduct);
router.put('/:id', authMiddleware, isAdmin, productsController.updateProduct);
router.delete('/:id', authMiddleware, isAdmin, productsController.deleteProduct);
router.post('/:id/reviews', productsController.addReview);
router.post('/:id/questions', productsController.addQuestion);
router.put('/questions/:questionId/answer', productsController.answerQuestion);

module.exports = router;
