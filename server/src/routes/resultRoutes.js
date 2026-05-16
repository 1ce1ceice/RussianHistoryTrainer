const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  createResult,
  getMyResults,
} = require('../controllers/resultController');

router.post('/', authMiddleware, createResult);
router.get('/my', authMiddleware, getMyResults);

module.exports = router;