const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

router.get('/stats', authMiddleware, isAdmin, DashboardController.getDashboardStats);

module.exports = router;
