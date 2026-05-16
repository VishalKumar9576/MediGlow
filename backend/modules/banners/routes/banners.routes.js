const express = require('express');
const router = express.Router();
const bannersController = require('../controllers/banners.controller');

router.get('/', bannersController.getAllBanners);
router.get('/:type', bannersController.getBannersByType);

module.exports = router;
