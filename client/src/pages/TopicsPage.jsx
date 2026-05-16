import { Link } from 'react-router-dom';
import { topics, questions } from '../data/questions.js';

export default function TopicsPage() {
  return (
    <section>
      <div className="page-title">
        <p className="eyebrow">Каталог</p>
        <h1>Выберите тему</h1>
        <p>Каждая тема содержит несколько вопросов с автоматической проверкой.</p>
      </div>
      <div className="cards">
        {topics.map((topic) => {
          const count = questions.filter((question) => question.topicId === topic.id).length;
          return (
            <article className="card" key={topic.id}>
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
              <span className="badge">{count} вопроса</span>
              <Link className="button primary full" to={`/quiz/${topic.id}`}>Пройти тест</Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
