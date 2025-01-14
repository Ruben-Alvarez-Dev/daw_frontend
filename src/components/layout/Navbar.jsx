import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          RestaurantApp
        </Link>
      </div>

      <div className="navbar-user">
        {user ? (
          <>
            <span className="user-info">
              {user.name} ({user.role})
            </span>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-button">
                Panel Admin
              </Link>
            )}
            <button onClick={logout} className="nav-button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="nav-button">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
