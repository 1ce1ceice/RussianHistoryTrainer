import { useState } from 'react';
import { clearResults, getResults } from '../utils/storage.js';

export default function ResultsPage() {
  const [results, setResults] = useState(getResults());

  function handleClear() {
    clearResults();
    setResults([]);
  }

  return (
    <section>
      <div className="page-title row">
        <div>
          <p className="eyebrow">Статистика</p>
          <h1>История прохождений</h1>
          <p>Результаты сохраняются локально в браузере пользователя.</p>
        </div>
        {results.length > 0 && <button className="button secondary" onClick={handleClear}>Очистить</button>}
      </div>

      {results.length === 0 ? (
        <div className="empty"><h2>Пока нет результатов</h2><p>Пройдите любой тест, чтобы увидеть статистику.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Дата</th><th>Тема</th><th>Правильно</th><th>Процент</th></tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.date}</td>
                  <td>{result.topicTitle}</td>
                  <td>{result.correctCount} / {result.totalCount}</td>
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
