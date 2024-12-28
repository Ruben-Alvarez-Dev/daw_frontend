import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { ROLES } from '../../../constants/roles';
import './Aside.css';

const Aside = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isSidebarOpen } = useApp();

    const getMenuItems = () => {
        switch (user?.role) {
            case ROLES.ADMIN:
                return [
                    { label: 'Dashboard', path: '/admin' },
                    { label: 'Usuarios', path: '/admin/users' }
                ];
            case ROLES.SUPERVISOR:
                return [
                    { label: 'Dashboard', path: '/supervisor' },
                    { label: 'Restaurantes', path: '/supervisor/restaurants' }
                ];
            case ROLES.WAITER:
                return [
                    { label: 'Dashboard', path: '/waiter' },
                    { label: 'Mesas', path: '/waiter/tables' }
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    if (!user || menuItems.length === 0) return null;

    return (
        <aside className={`aside ${isSidebarOpen ? 'open' : 'closed'}`}>
            <nav className="aside-nav">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="aside-item"
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Aside;
