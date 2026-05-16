import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Brain, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Проверь свои знания</p>
        <h1>
  <span className="title-top">Онлайн-тренажер</span>
  <span className="title-bottom">по истории России</span></h1>
        <p className="lead">
          Приложение помогает повторять исторические темы, проходить тесты и сохранять результаты тренировок в браузере.
        </p>
        <div className="actions">
          <Link className="button primary" to="/topics">
            Начать тренировку <ArrowRight size={18} />
          </Link>
          <Link className="button secondary" to="/results">Посмотреть результаты</Link>
        </div>
      </div>
      <div className="feature-grid">
        <article className="feature-card"><Brain /><h3>Тематические тесты</h3><p>Вопросы сгруппированы по периодам истории России.</p></article>
        <article className="feature-card"><BarChart3 /><h3>Результаты</h3><p>После теста пользователь видит процент правильных ответов.</p></article>
        <article className="feature-card"><Clock /><h3>История попыток</h3><p>Итоги сохраняются в LocalStorage и доступны на отдельной странице.</p></article>
      </div>
    </section>
  );
}
