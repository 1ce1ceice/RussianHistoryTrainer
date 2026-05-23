const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  createTopic,
  createQuestion,
  getTopics,
  deleteTopic,
  getQuestions,
    deleteQuestion,
    updateQuestion,
} = require('../controllers/adminController');

router.post('/topics', authMiddleware, adminMiddleware, createTopic);
router.post('/questions', authMiddleware, adminMiddleware, createQuestion);
router.get('/topics', authMiddleware, adminMiddleware, getTopics);
router.delete('/topics/:id', authMiddleware, adminMiddleware, deleteTopic);
router.get('/questions', authMiddleware, adminMiddleware, getQuestions);
router.delete('/questions/:id', authMiddleware, adminMiddleware, deleteQuestion);
router.put('/questions/:id', authMiddleware, adminMiddleware, updateQuestion);

module.exports = router;
