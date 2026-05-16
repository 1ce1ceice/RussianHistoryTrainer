import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
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

    const data = await registerUser(formData);

    if (data.id) {
      navigate('/login');
      return;
    }

    setError(data.message || 'Не удалось зарегистрироваться');
  };

  return (
    <section className="auth-card">
      <h1>Регистрация</h1>
      <p>Создайте аккаунт для сохранения истории прохождений.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Имя
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите имя"
            required
          />
        </label>

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
          Создать аккаунт
        </button>
      </form>

      <p className="auth-link">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </section>
  );
}