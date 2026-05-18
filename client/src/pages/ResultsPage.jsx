import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyResults } from '../api/resultApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ResultsPage() {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      const data = await getMyResults(token);
      setResults(Array.isArray(data) ? data : []);
      setIsLoading(false);
    };

    loadResults();
  }, [token]);

  if (!token) {
    return (
      <section>
        <div className="empty">
          <h2>Войдите в аккаунт</h2>
          <p>История результатов доступна только авторизованным пользователям.</p>
          <Link className="button primary" to="/login">
            Войти
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-title row">
        <div>
          <p className="eyebrow">Статистика</p>
          <h1>История прохождений</h1>
          <p>Результаты сохраняются в PostgreSQL и привязаны к текущему пользователю.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="empty">
          <h2>Загрузка результатов...</h2>
        </div>
      ) : results.length === 0 ? (
        <div className="empty">
          <h2>Пока нет результатов</h2>
          <p>Пройдите любой тест, чтобы увидеть статистику.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тема</th>
                <th>Правильно</th>
                <th>Процент</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{new Date(result.created_at).toLocaleString('ru-RU')}</td>
                  <td>{result.topic_title}</td>
                  <td>{result.score} / {result.total}</td>
                  <td>{result.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
