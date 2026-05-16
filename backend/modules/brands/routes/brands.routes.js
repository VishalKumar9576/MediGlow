const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brands.controller');
const { authMiddleware, isAdmin } = require('../../../shared/auth.middleware');

router.get('/', brandsController.getAllBrands);
router.post('/', authMiddleware, isAdmin, brandsController.addBrand);
router.put('/:id', authMiddleware, isAdmin, brandsController.updateBrand);
router.delete('/:id', authMiddleware, isAdmin, brandsController.deleteBrand);

module.exports = router;
