import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const data = await loginUser(formData);

    if (data.token) {
      login(data);
      navigate('/profile');
      return;
    }

    setError(data.message || 'Неправильный логин или пароль');
  };

  return (
    <section className="auth-card">
      <h1>Вход</h1>
      <p>Войдите в аккаунт, чтобы сохранять результаты тестирования.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourEmail@mail.ru"
            required
          />
        </label>

        <label>
          Пароль
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="button primary full" type="submit">
          Войти
        </button>
      </form>

      <p className="auth-link">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </section>
  );
}
