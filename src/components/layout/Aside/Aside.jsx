import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../constants/roles';
import './Aside.css';

const menuItems = {
    [ROLES.ADMIN]: [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/users', text: 'Usuarios' },
        { to: '/restaurants', text: 'Restaurantes' },
        { to: '/tables', text: 'Mesas' },
        { to: '/zones', text: 'Zonas' },
        { to: '/reservations', text: 'Reservas' },
        { to: '/profile', text: 'Perfil' },
        { to: '/settings', text: 'Ajustes' }
    ],
    [ROLES.SUPERVISOR]: [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/tables', text: 'Mesas' },
        { to: '/zones', text: 'Zonas' },
        { to: '/reservations', text: 'Reservas' },
        { to: '/profile', text: 'Perfil' },
        { to: '/settings', text: 'Ajustes' }
    ],
    [ROLES.WAITER]: [
        { to: '/dashboard', text: 'Dashboard' },
        { to: '/my-tables', text: 'Mis Mesas' },
        { to: '/my-reservations', text: 'Mis Reservas' },
        { to: '/profile', text: 'Perfil' },
        { to: '/settings', text: 'Ajustes' }
    ]
};

const Aside = () => {
    const { user } = useAuth();
    const items = menuItems[user?.role] || [];

    return (
        <aside className="aside">
            <nav className="aside-nav">
                {items.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        className="aside-link"
                    >
                        <span className="aside-link-text">{item.text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Aside;
