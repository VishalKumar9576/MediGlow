const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

// All routes require authentication and admin role
router.use(authMiddleware, isAdmin);

router.get('/settings', AdminController.getSettings);
router.put('/settings', AdminController.updateSettings);
router.put('/settings/nested', AdminController.updateNestedSettings);
router.get('/activity', AdminController.getActivityLog);
router.post('/upload-profile-image', AdminController.uploadProfileImage);

module.exports = router;
