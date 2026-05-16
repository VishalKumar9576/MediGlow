const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');
const { authMiddleware } = require('../../../shared/auth.middleware');

router.use(authMiddleware);

router.post('/create-order', paymentsController.createOrder);
router.post('/verify', paymentsController.verifyPayment);

module.exports = router;
