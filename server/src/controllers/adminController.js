const pool = require('../db');

const createTopic = async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO topics (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE TOPIC ERROR:', error);

    res.status(500).json({
      message: 'Ошибка создания темы',
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const {
      topicId,
      text,
      explanation,
      answers,
      correctAnswer,
    } = req.body;

    const questionResult = await pool.query(
      `
      INSERT INTO questions
      (topic_id, text, explanation)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [topicId, text, explanation]
    );

    const question = questionResult.rows[0];

    for (const answer of answers) {
      await pool.query(
        `
        INSERT INTO answers
        (question_id, text, is_correct)
        VALUES ($1,$2,$3)
        `,
        [
          question.id,
          answer,
          answer === correctAnswer,
        ]
      );
    }

    res.status(201).json(question);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка создания вопроса',
    });
  }
};

module.exports = {
  createTopic,
  createQuestion,
};