const express = require('express');
const router = express.Router();

const {
  getQuestionsByTopic,
} = require('../controllers/questionController');

router.get('/topic/:topicId', getQuestionsByTopic);

module.exports = router;