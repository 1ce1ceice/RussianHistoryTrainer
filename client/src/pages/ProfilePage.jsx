import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, logout } = useAuth();

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

      <button className="button secondary full" type="button" onClick={logout}>
        Выйти
      </button>
    </section>
  );
}
