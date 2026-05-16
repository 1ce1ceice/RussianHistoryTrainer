const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const topicRoutes = require('./routes/topicRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend все круто работает!',
  });
});

app.use('/api/topics', topicRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});