const pool = require('../db');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка получения профиля',
    });
  }
};

module.exports = {
  getProfile,
};