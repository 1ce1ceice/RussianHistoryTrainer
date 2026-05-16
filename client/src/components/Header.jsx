import { Link, NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Header() {
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
      </nav>
    </header>
  );
}
