const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

router.get('/', homeController.getHome);
router.get('/collection', homeController.getCollectionProducts);
router.get('/search', homeController.searchProducts);

module.exports = router;
