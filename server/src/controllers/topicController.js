const pool = require('../db');

const getTopics = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM topics ORDER BY id'
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Ошибка сервера',
    });
  }
};

module.exports = {
  getTopics,
};