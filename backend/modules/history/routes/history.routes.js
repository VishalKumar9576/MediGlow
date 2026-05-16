const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const { authMiddleware } = require('../../../shared/auth.middleware');

router.use(authMiddleware);

router.get('/', historyController.getHistory);
router.delete('/:historyId', historyController.deleteHistory);

module.exports = router;
