const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  createResult,
  getMyResults,
  getStats,
} = require('../controllers/resultController');

router.post('/', authMiddleware, createResult);
router.get('/my', authMiddleware, getMyResults);
router.get('/stats', authMiddleware, getStats);

module.exports = router;