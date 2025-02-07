import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const { user } = useContext(AuthContext);

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'Usuarios', icon: '👥' },
        { path: '/admin/tables', label: 'Mesas', icon: '🪑' },
        { path: '/admin/reservations', label: 'Reservas', icon: '📅' },
        { path: '/admin/configuration', label: 'Configuración', icon: '⚙️' }
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <h2>Panel Admin</h2>
                <div className="admin-user-info">
                    {user?.name}
                </div>
            </div>
            <nav className="admin-sidebar-nav">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className="admin-sidebar-link"
                    >
                        <span className="admin-sidebar-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
