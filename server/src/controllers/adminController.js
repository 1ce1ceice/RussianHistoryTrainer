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
        q.id,
        q.topic_id,
        q.text,
        q.explanation,
        t.title AS topic,
        ARRAY_AGG(a.text ORDER BY a.id) AS answers,
        MAX(CASE WHEN a.is_correct = true THEN a.text END) AS correct_answer
      FROM questions q
      JOIN topics t ON t.id = q.topic_id
      LEFT JOIN answers a ON a.question_id = q.id
      GROUP BY q.id, q.topic_id, q.text, q.explanation, t.title
      ORDER BY q.id
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

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { topicId, text, explanation, answers, correctAnswer } = req.body;

    const questionResult = await pool.query(
      `
      UPDATE questions
      SET topic_id = $1,
          text = $2,
          explanation = $3
      WHERE id = $4
      RETURNING *
      `,
      [topicId, text, explanation, id]
    );

    await pool.query(
      `
      DELETE FROM answers
      WHERE question_id = $1
      `,
      [id]
    );

    for (const answer of answers) {
      await pool.query(
        `
        INSERT INTO answers (question_id, text, is_correct)
        VALUES ($1, $2, $3)
        `,
        [id, answer, answer === correctAnswer]
      );
    }

    res.json(questionResult.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка редактирования вопроса',
    });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const result = await pool.query(
      `
      UPDATE topics
      SET title = $1,
          description = $2
      WHERE id = $3
      RETURNING *
      `,
      [title, description, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка редактирования темы',
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
    updateQuestion,
  updateTopic,
};