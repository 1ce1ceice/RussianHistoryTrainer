import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen,
  LogIn,
  LogOut,
  UserPlus,
  CircleUser,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="header">
      <Link className="brand" to="/">
        <BookOpen size={24} />
        <span>История России</span>
      </Link>

      <nav className="nav">
        <NavLink to="/topics">Темы</NavLink>
        <NavLink to="/results">Результаты</NavLink>
        <NavLink to="/about">О проекте</NavLink>

        {token && (
          <NavLink to="/profile" title="Профиль">
            <CircleUser size={20} />
          </NavLink>
        )}

        {token ? (
          <button
            className="nav-icon"
            type="button"
            title="Выход"
            onClick={logout}
          >
            <LogOut size={20} />
          </button>
        ) : (
          <>
            <NavLink to="/register" title="Регистрация">
              <UserPlus size={20} />
            </NavLink>

            <NavLink to="/login" title="Вход">
              <LogIn size={20} />
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}