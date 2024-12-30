import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { userActive, cardActive, cardsShown } = useApp();
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
                        <div className="navbar-user">
                            {userActive && (
                                <span className="active-user">
                                    Usuario activo: {userActive.name}
                                </span>
                            )}
                            {cardsShown.length > 0 && (
                                <span className="shown-cards">
                                    Cards mostradas: {cardsShown.join(', ')}
                                </span>
                            )}
                            {cardActive && (
                                <span className="active-card">
                                    Card activa: {cardActive}
                                </span>
                            )}
                            <span className="user-name">
                                Bienvenido, {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="navbar-button"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
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
