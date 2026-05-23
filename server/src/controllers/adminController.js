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

const getTopics = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM topics
      ORDER BY id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка получения тем',
    });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM topics
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: 'Тема удалена',
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка удаления темы',
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        questions.id,
        questions.text,
        topics.title AS topic
      FROM questions
      JOIN topics
      ON topics.id = questions.topic_id
      ORDER BY questions.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка получения вопросов',
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM questions
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: 'Вопрос удален',
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка удаления вопроса',
    });
  }
};

module.exports = {
  createTopic,
  createQuestion,
  getTopics,
  deleteTopic,
  getQuestions,
  deleteQuestion,
};