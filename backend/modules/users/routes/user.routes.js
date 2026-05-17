const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

router.get('/', authMiddleware, isAdmin, userController.getCustomers);
router.get('/customers/stats', authMiddleware, isAdmin, userController.getCustomerStats);
router.post('/', authMiddleware, isAdmin, userController.createCustomer);
router.put('/:id', authMiddleware, isAdmin, userController.updateCustomer);
router.delete('/:id', authMiddleware, isAdmin, userController.deleteCustomer);

module.exports = router;
