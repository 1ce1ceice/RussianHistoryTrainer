import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!token) {
        return;
      }

      const response = await fetch(
  `${API_URL}/results/stats`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();
      setStats(data);
    };

    loadStats();
  }, [token]);

  if (!user) {
    return (
      <section className="auth-card">
        <h1>Профиль</h1>
        <p>Загрузка данных пользователя...</p>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <h1>Личный кабинет</h1>
      <p>На этой странице отображается информация о текущем пользователе.</p>

      <div className="profile-info">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.role}</p>
      </div>

      <h2>Статистика</h2>

      <div className="profile-info">
        <p><strong>Всего тестов:</strong> {stats?.total_tests ?? 0}</p>
        <p><strong>Средний результат:</strong> {stats?.average_percent ?? 0}%</p>
        <p><strong>Лучший результат:</strong> {stats?.best_percent ?? 0}%</p>
        <p><strong>Пройдено тем:</strong> {stats?.completed_topics ?? 0}</p>
      </div>

      <button className="button secondary full" type="button" onClick={logout}>
        Выйти
      </button>
    </section>
  );
}