import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { saveResult } from '../api/resultApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL;

export default function QuizPage() {
  const { topicId } = useParams();
  const { token } = useAuth();

  const [topic, setTopic] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuizData = async () => {
      setIsLoading(true);
      setTopic(null);
      setQuizQuestions([]);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsFinished(false);

      const topicsResponse = await fetch(`${API_URL}/topics`);
      const topicsData = await topicsResponse.json();
      const foundTopic = Array.isArray(topicsData)
        ? topicsData.find((item) => item.id === Number(topicId))
        : null;

      if (!foundTopic) {
        setIsLoading(false);
        return;
      }

      const questionsResponse = await fetch(`${API_URL}/questions/topic/${foundTopic.id}`);
      const questionsData = await questionsResponse.json();

      setTopic(foundTopic);
      setQuizQuestions(Array.isArray(questionsData) ? questionsData : []);
      setIsLoading(false);
    };

    loadQuizData();
  }, [topicId]);

  if (isLoading) {
    return (
      <section className="empty">
        <h1>Загрузка вопросов...</h1>
      </section>
    );
  }

  if (!topic) {
    return (
      <section className="empty">
        <h1>Тема не найдена</h1>
        <Link to="/topics">Вернуться к темам</Link>
      </section>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <section className="empty">
        <h1>Вопросы не найдены</h1>
        <Link to="/topics">Вернуться к темам</Link>
      </section>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];
  const correctCount = quizQuestions.filter(
    (question) => selectedAnswers[question.id] === question.correctAnswer,
  ).length;
  const percent = Math.round((correctCount / quizQuestions.length) * 100);

  function handleAnswer(answer) {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
  }

  async function handleNext() {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    if (token) {
      await saveResult(token, {
        topicId: topic.id,
        score: correctCount,
        total: quizQuestions.length,
        percent,
      });
    }

    setIsFinished(true);
  }

  if (isFinished) {
    return (
      <section className="result-box">
        <p className="eyebrow">Результат</p>
        <h1>{topic.title}</h1>
        <div className="score">{percent}%</div>
        <p>Правильных ответов: {correctCount} из {quizQuestions.length}</p>

        <div className="review-list">
          {quizQuestions.map((question) => (
            <article className="review-card" key={question.id}>
              <h3>{question.text}</h3>
              <p>Ваш ответ: <b>{selectedAnswers[question.id]}</b></p>
              <p>Правильный ответ: <b>{question.correctAnswer}</b></p>
              <small>{question.explanation}</small>
            </article>
          ))}
        </div>

        <div className="actions center">
          <Link className="button primary" to="/topics">Выбрать другую тему</Link>
          <Link className="button secondary" to="/results">История результатов</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz">
      <div className="quiz-header">
        <div>
          <p className="eyebrow">Тест</p>
          <h1>{topic.title}</h1>
        </div>
        <span className="badge">{currentIndex + 1} / {quizQuestions.length}</span>
      </div>

      <article className="question-card">
        <h2>{currentQuestion.text}</h2>

        <div className="answers">
          {currentQuestion.answers.map((answer) => (
            <button
              className={selectedAnswers[currentQuestion.id] === answer ? 'answer selected' : 'answer'}
              key={answer}
              onClick={() => handleAnswer(answer)}
              type="button"
            >
              {answer}
            </button>
          ))}
        </div>

        <button
          className="button primary next"
          disabled={!selectedAnswers[currentQuestion.id]}
          onClick={handleNext}
          type="button"
        >
          {currentIndex === quizQuestions.length - 1 ? 'Завершить тест' : 'Следующий вопрос'}
        </button>
      </article>
    </section>
  );
}
