const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authMiddleware } = require('../../../shared/auth.middleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCart);
router.delete('/:cartId', cartController.removeFromCart);

module.exports = router;
