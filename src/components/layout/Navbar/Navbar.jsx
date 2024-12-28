import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    Restaurant Manager
                </Link>
            </div>
            
            <div className="navbar-menu">
                {user ? (
                    <>
                        <span className="navbar-user">
                            Bienvenido, {user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="navbar-button"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-button">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="navbar-button navbar-button-primary">
                            Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
