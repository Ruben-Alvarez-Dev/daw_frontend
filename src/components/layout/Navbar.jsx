import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          RestaurantApp
        </Link>
      </div>

      <div className="navbar__user">
        {user ? (
          <>
            <span className="navbar__user-info">
              {user.name} ({user.role})
            </span>
            {user.role === 'admin' && (
              <Link to="/admin" className="navbar__button">
                Panel Admin
              </Link>
            )}
            <button onClick={logout} className="navbar__button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__button">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="navbar__button">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
