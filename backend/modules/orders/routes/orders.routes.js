const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { authMiddleware } = require('../../../shared/auth.middleware');

router.use(authMiddleware);

router.post('/place', ordersController.placeOrder);
router.get('/', ordersController.getUserOrders);
router.get('/:orderId', ordersController.getOrderById);
router.get('/:orderId/invoice', ordersController.downloadInvoice);

module.exports = router;
