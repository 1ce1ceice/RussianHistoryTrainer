const pool = require('../db');

const createResult = async (req, res) => {
  try {
    const { topicId, score, total, percent } = req.body;

    const result = await pool.query(
      `INSERT INTO test_results (user_id, topic_id, score, total, percent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, topicId, score, total, percent]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE RESULT ERROR:', error);

    res.status(500).json({
      message: 'Ошибка сохранения результата',
    });
  }
};

const getMyResults = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        test_results.id,
        test_results.score,
        test_results.total,
        test_results.percent,
        test_results.created_at,
        topics.title AS topic_title
       FROM test_results
       JOIN topics ON topics.id = test_results.topic_id
       WHERE test_results.user_id = $1
       ORDER BY test_results.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('GET RESULTS ERROR:', error);

    res.status(500).json({
      message: 'Ошибка получения результатов',
    });
  }
};

module.exports = {
  createResult,
  getMyResults,
};