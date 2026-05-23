const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resultRoutes = require('./routes/resultRoutes');
const questionRoutes = require('./routes/questionRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const topicRoutes = require('./routes/topicRoutes');

const app = express();

app.use(cors());
app.get('/', (req, res) => {
  res.send('RussianHistoryTrainer API is running');
});
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend все круто работает!',
  });
});

app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});