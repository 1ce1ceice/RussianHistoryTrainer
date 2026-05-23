import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = 'https://russianhistorytrainer.onrender.com/api';

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

  const [questions, setQuestions] = useState([]);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editQuestionForm, setEditQuestionForm] = useState({
  topicId: '',
  text: '',
  explanation: '',
  answers: ['', '', '', ''],
  correctAnswer: '',
});

  const [editingTopic, setEditingTopic] = useState(null);
  const [editTopicForm, setEditTopicForm] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    const loadTopics = async () => {
      const response = await fetch(`${API_URL}/topics`);
      const data = await response.json();

      setTopics(Array.isArray(data) ? data : []);
    };

    loadTopics();
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!token || user?.role !== 'admin') {
        return;
      }

      const response = await fetch(`${API_URL}/admin/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setQuestions(Array.isArray(data) ? data : []);
    };

    loadQuestions();
  }, [token, user]);

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

  const handleQuestionSubmit = async (event) => {
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
        answers: questionForm.answers.filter((answer) => !!answer),
        correctAnswer: questionForm.correctAnswer,  
      }),
    });

    const data = await response.json();

    if (data.id) {
      const selectedTopic = topics.find((topic) => topic.id === Number(questionForm.topicId));

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: data.id,
          topic_id: Number(questionForm.topicId),
          text: data.text,
          explanation: data.explanation,
          topic: selectedTopic?.title || 'Без темы',
        },
      ]);

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

    setMessage(data.message || 'Ошибка сохранения вопроса');
  };

  const startEditQuestion = (question) => {
    setEditingQuestion(question);
    setEditQuestionForm({
  topicId: String(question.topic_id || ''),
  text: question.text,
  explanation: question.explanation || '',
  answers: question.answers || ['', '', '', ''],
  correctAnswer: question.correct_answer || '',
});
    setMessage('');
  };

  const handleEditQuestionSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`${API_URL}/admin/questions/${editingQuestion.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topicId: Number(editQuestionForm.topicId),
        text: editQuestionForm.text,
        explanation: editQuestionForm.explanation,
      }),
    });

    const data = await response.json();

    if (data.id) {
      const selectedTopic = topics.find((topic) => topic.id === Number(editQuestionForm.topicId));

      setQuestions((prevQuestions) => prevQuestions.map((question) => (
        question.id === data.id
          ? {
              id: data.id,
              topic_id: Number(editQuestionForm.topicId),
              text: data.text,
              explanation: data.explanation,
              topic: selectedTopic?.title || 'Без темы',
            }
          : question
      )));

      setEditingQuestion(null);
      setMessage('Вопрос успешно обновлен');
      return;
    }

    setMessage(data.message || 'Ошибка редактирования вопроса');
  };

  const startEditTopic = (topic) => {
    setEditingTopic(topic);
    setEditTopicForm({
      title: topic.title,
      description: topic.description,
    });
    setMessage('');
  };

  const handleEditTopicSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`${API_URL}/admin/topics/${editingTopic.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editTopicForm),
    });

    const data = await response.json();

    if (data.id) {
      setTopics((prevTopics) => prevTopics.map((topic) => (
        topic.id === data.id ? data : topic
      )));

      setQuestions((prevQuestions) => prevQuestions.map((question) => (
        question.topic_id === data.id
          ? {
              ...question,
              topic: data.title,
            }
          : question
      )));

      setEditingTopic(null);
      setMessage('Тема успешно обновлена');
      return;
    }

    setMessage(data.message || 'Ошибка редактирования темы');
  };

  const deleteTopic = async (topicId) => {
    const isConfirmed = window.confirm('Удалить эту тему?');

    if (!isConfirmed) {
      return;
    }

    const response = await fetch(`${API_URL}/admin/topics/${topicId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== topicId));

      if (editingTopic?.id === topicId) {
        setEditingTopic(null);
      }

      setMessage(data.message || 'Тема удалена');
      return;
    }

    setMessage(data.message || 'Ошибка удаления темы');
  };

  const deleteQuestion = async (questionId) => {
    const isConfirmed = window.confirm('Удалить этот вопрос?');

    if (!isConfirmed) {
      return;
    }

    const response = await fetch(`${API_URL}/admin/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));

      if (editingQuestion?.id === questionId) {
        setEditingQuestion(null);
      }

      setMessage(data.message || 'Вопрос удален');
      return;
    }

    setMessage(data.message || 'Ошибка удаления вопроса');
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

        <form className="auth-card auth-form" onSubmit={handleQuestionSubmit}>
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
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key={topic.id}>
                    <td>
                      <span>{topic.id}</span>
                    </td>
                    <td>{topic.title}</td>
                    <td>{topic.description}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => startEditTopic(topic)}
                        >
                          Редактировать
                        </button>

                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => deleteTopic(topic.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="admin-table auth-card">
        <h2>Список вопросов</h2>

        {questions.length === 0 ? (
          <p>Вопросы пока не добавлены.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Вопрос</th>
                  <th>Тема</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td>
                      <span>{question.id}</span>
                    </td>
                    <td>{question.text}</td>
                    <td>{question.topic}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => startEditQuestion(question)}
                        >
                          Редактировать
                        </button>

                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editingTopic && (
        <div className="modal-overlay">
          <form className="modal auth-form" onSubmit={handleEditTopicSubmit}>
            <h2>Редактировать тему</h2>

            <label>
              Название темы
              <input
                type="text"
                value={editTopicForm.title}
                onChange={(event) => setEditTopicForm({
                  ...editTopicForm,
                  title: event.target.value,
                })}
                required
              />
            </label>

            <label>
              Описание
              <textarea
                value={editTopicForm.description}
                onChange={(event) => setEditTopicForm({
                  ...editTopicForm,
                  description: event.target.value,
                })}
                required
              />
            </label>

            <button className="button primary full" type="submit">
              Сохранить изменения
            </button>

            <button
              className="button secondary full"
              type="button"
              onClick={() => setEditingTopic(null)}
            >
              Отмена
            </button>
          </form>
        </div>
      )}
      {editingQuestion && (
        <div className="modal-overlay">
          <form className="modal auth-form" onSubmit={handleEditQuestionSubmit}>
            <h2>Редактировать вопрос</h2>

            <div className="readonly-topic">
              <span>Тема</span>
              <div className="readonly-topic-value">
                {topics.find((topic) => topic.id === Number(editQuestionForm.topicId))?.title || 'Без темы'}
              </div>
            </div>

            <label>
              Текст вопроса
              <textarea
                name="text"
                value={editQuestionForm.text}
                onChange={(event) => setEditQuestionForm({
                  ...editQuestionForm,
                  text: event.target.value,
                })}
                required
              />
            </label>

            <label>
              Объяснение
              <textarea
                name="explanation"
                value={editQuestionForm.explanation}
                onChange={(event) => setEditQuestionForm({
                  ...editQuestionForm,
                  explanation: event.target.value,
                })}
                required
              />
            </label>

            {editQuestionForm.answers.map((answer, index) => (
  <label key={index}>
    Ответ {index + 1}

    <input
      value={answer}
      onChange={(event) => {
        const updated = [...editQuestionForm.answers];

        updated[index] = event.target.value;

        setEditQuestionForm({
          ...editQuestionForm,
          answers: updated,
        });
      }}
    />
  </label>
))}

<label>
  Правильный ответ

  <input
    value={editQuestionForm.correctAnswer}
    onChange={(event) =>
      setEditQuestionForm({
        ...editQuestionForm,
        correctAnswer: event.target.value,
      })
    }
  />
</label>

            <button className="button primary full" type="submit">
              Сохранить изменения
            </button>

            <button
              className="button secondary full"
              type="button"
              onClick={() => setEditingQuestion(null)}
            >
              Отмена
            </button>
          </form>
        </div>
      )}
    </section>
  );
}