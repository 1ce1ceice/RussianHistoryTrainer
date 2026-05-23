import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://russianhistorytrainer.onrender.com/api';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      const response = await fetch(`${API_URL}/topics`);
      const data = await response.json();

      setTopics(Array.isArray(data) ? data : []);
      setIsLoading(false);
    };

    loadTopics();
  }, []);

  return (
    <section>
      <div className="page-title">
        <p className="eyebrow">Каталог</p>
        <h1>Выберите тему</h1>
        <p>Каждая тема содержит несколько вопросов с автоматической проверкой.</p>
      </div>

      {isLoading ? (
        <div className="empty">
          <h2>Загрузка тем...</h2>
        </div>
      ) : topics.length === 0 ? (
        <div className="empty">
          <h2>Темы пока не добавлены</h2>
        </div>
      ) : (
        <div className="cards">
          {topics.map((topic, index) => {

            return (
              <article className="card" key={topic.id}>
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
                <span className="badge">Тема №{index + 1}</span>
                <Link className="button primary full" to={`/quiz/${topic.id}`}>
                  Пройти тест
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
