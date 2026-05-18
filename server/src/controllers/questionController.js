const pool = require('../db');

const getQuestionsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const questionsResult = await pool.query(
      `
      SELECT *
      FROM questions
      WHERE topic_id = $1
      ORDER BY id
      `,
      [topicId]
    );

    const questions = [];

    for (const question of questionsResult.rows) {
      const answersResult = await pool.query(
        `
        SELECT id, text
        FROM answers
        WHERE question_id = $1
        ORDER BY id
        `,
        [question.id]
      );

      const correctAnswerResult = await pool.query(
        `
        SELECT text
        FROM answers
        WHERE question_id = $1
        AND is_correct = true
        LIMIT 1
        `,
        [question.id]
      );

      questions.push({
        id: question.id,
        topicId,
        text: question.text,
        answers: answersResult.rows.map((answer) => answer.text),
        correctAnswer: correctAnswerResult.rows[0]?.text,
        explanation: question.explanation,
      });
    }

    res.json(questions);
  } catch (error) {
    console.error('GET QUESTIONS ERROR:', error);

    res.status(500).json({
      message: 'Ошибка получения вопросов',
    });
  }
};

module.exports = {
  getQuestionsByTopic,
};