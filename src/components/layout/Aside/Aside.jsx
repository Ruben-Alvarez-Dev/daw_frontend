import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../constants/roles';
import './Aside.css';

const Aside = () => {
    const { user } = useAuth();

    const renderAdminLinks = () => (
        <div className="aside-section">
            <h2 className="aside-section-title">Administración</h2>
            <nav className="aside-nav">
                <NavLink to="/users" className="aside-link">
                    <span className="aside-link-text">Usuarios</span>
                </NavLink>
                <NavLink to="/restaurants" className="aside-link">
                    <span className="aside-link-text">Restaurantes</span>
                </NavLink>
            </nav>
        </div>
    );

    const renderSupervisorLinks = () => (
        <div className="aside-section">
            <h2 className="aside-section-title">Gestión</h2>
            <nav className="aside-nav">
                <NavLink to="/tables" className="aside-link">
                    <span className="aside-link-text">Mesas</span>
                </NavLink>
                <NavLink to="/reservations" className="aside-link">
                    <span className="aside-link-text">Reservas</span>
                </NavLink>
            </nav>
        </div>
    );

    const renderWaiterLinks = () => (
        <div className="aside-section">
            <h2 className="aside-section-title">Servicio</h2>
            <nav className="aside-nav">
                <NavLink to="/my-tables" className="aside-link">
                    <span className="aside-link-text">Mis Mesas</span>
                </NavLink>
                <NavLink to="/my-reservations" className="aside-link">
                    <span className="aside-link-text">Mis Reservas</span>
                </NavLink>
            </nav>
        </div>
    );

    return (
        <aside className="aside">
            <div className="aside-section">
                <h2 className="aside-section-title">General</h2>
                <nav className="aside-nav">
                    <NavLink to="/dashboard" className="aside-link">
                        <span className="aside-link-text">Dashboard</span>
                    </NavLink>
                </nav>
            </div>

            {user?.role === ROLES.ADMIN && renderAdminLinks()}
            {user?.role === ROLES.SUPERVISOR && renderSupervisorLinks()}
            {user?.role === ROLES.WAITER && renderWaiterLinks()}
        </aside>
    );
};

export default Aside;
