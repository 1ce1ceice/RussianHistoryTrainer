import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = 'http://localhost:5001/api';

export default function AdminPage() {
  const { user, token } = useAuth();

  const [topicForm, setTopicForm] = useState({
    title: '',
    description: '',
  });

  const [questionForm, setQuestionForm] = useState({
    topicId: '',
    text: '',
    explanation: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
  });

  const [message, setMessage] = useState('');

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      const response = await fetch(`${API_URL}/topics`);
      const data = await response.json();

      setTopics(Array.isArray(data) ? data : []);
    };

    loadTopics();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <section className="auth-card">
        <h1>Доступ запрещен</h1>
        <p>Админ-панель доступна только пользователю с ролью admin.</p>
      </section>
    );
  }

  const handleTopicChange = (event) => {
    const { name, value } = event.target;

    setTopicForm({
      ...topicForm,
      [name]: value,
    });
  };

  const handleQuestionChange = (event) => {
    const { name, value } = event.target;

    setQuestionForm({
      ...questionForm,
      [name]: value,
    });
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...questionForm.answers];
    updatedAnswers[index] = value;

    setQuestionForm({
      ...questionForm,
      answers: updatedAnswers,
    });
  };

  const createTopic = async (event) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`${API_URL}/admin/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(topicForm),
    });

    const data = await response.json();

    if (data.id) {
      setMessage('Тема успешно создана');
      setTopics((prevTopics) => [...prevTopics, data]);
      setTopicForm({ title: '', description: '' });
      return;
    }

    setMessage(data.message || 'Ошибка создания темы');
  };

  const createQuestion = async (event) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`${API_URL}/admin/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...questionForm,
        topicId: Number(questionForm.topicId),
      }),
    });

    const data = await response.json();

    if (data.id) {
      setMessage('Вопрос успешно создан');
      setQuestionForm({
        topicId: '',
        text: '',
        explanation: '',
        answers: ['', '', '', ''],
        correctAnswer: '',
      });
      return;
    }

    setMessage(data.message || 'Ошибка создания вопроса');
  };

  return (
    <section className="admin-page">
      <p className="eyebrow">Администрирование</p>
      <h1>Панель администратора</h1>
      <p>Здесь можно создавать темы и вопросы для онлайн-тренажера</p>

      {message && <p className="form-message">{message}</p>}

      <div className="admin-grid">
        <form className="auth-card auth-form" onSubmit={createTopic}>
          <h2>Создать тему</h2>

          <label>
            Название темы
            <input
              name="title"
              type="text"
              value={topicForm.title}
              onChange={handleTopicChange}
              required
            />
          </label>

          <label>
            Описание
            <textarea
              name="description"
              value={topicForm.description}
              onChange={handleTopicChange}
              required
            />
          </label>

          <button className="button primary full" type="submit">
            Создать тему
          </button>
        </form>

        <form className="auth-card auth-form" onSubmit={createQuestion}>
          <h2>Создать вопрос</h2>

          <label>
            Тема
            <select
              name="topicId"
              value={questionForm.topicId}
              onChange={handleQuestionChange}
              required
            >
              <option value="">Выберите тему</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Текст вопроса
            <textarea
              name="text"
              value={questionForm.text}
              onChange={handleQuestionChange}
              required
            />
          </label>

          <label>
            Объяснение
            <textarea
              name="explanation"
              value={questionForm.explanation}
              onChange={handleQuestionChange}
              required
            />
          </label>

          {questionForm.answers.map((answer, index) => (
            <label key={index}>
              Ответ {index + 1}
              <input
                type="text"
                value={answer}
                onChange={(event) => handleAnswerChange(index, event.target.value)}
                required
              />
            </label>
          ))}

          <label>
            Правильный ответ
            <input
              name="correctAnswer"
              type="text"
              value={questionForm.correctAnswer}
              onChange={handleQuestionChange}
              required
            />
          </label>

          <button className="button primary full" type="submit">
            Создать вопрос
          </button>
        </form>
      </div>
      <div className="admin-table auth-card">
        <h2>Список тем</h2>

        {topics.length === 0 ? (
          <p>Темы пока не добавлены.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key={topic.id}>
                    <td>{topic.id}</td>
                    <td>{topic.title}</td>
                    <td>{topic.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}