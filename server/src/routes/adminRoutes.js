const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  createTopic,
  createQuestion,
} = require('../controllers/adminController');

router.post('/topics', authMiddleware, adminMiddleware, createTopic);
router.post('/questions', authMiddleware, adminMiddleware, createQuestion);

module.exports = router;
