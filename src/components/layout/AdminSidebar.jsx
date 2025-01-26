import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaChair, FaMap, FaCog } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    const [expandedSection, setExpandedSection] = useState(null);

    const isActive = (path) => {
        return location.pathname === path ? 'admin-sidebar__item--active' : '';
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="admin-sidebar">
            <Link to="/" className="admin-sidebar__brand">
                RestaurantApp
            </Link>

            <nav className="admin-sidebar__nav">
                <Link 
                    to="/admin/users" 
                    className={`admin-sidebar__item ${isActive('/admin/users')}`}
                >
                    <FaUsers className="admin-sidebar__icon" />
                    <span>Usuarios</span>
                </Link>

                <Link 
                    to="/admin/reservations" 
                    className={`admin-sidebar__item ${isActive('/admin/reservations')}`}
                >
                    <FaCalendarAlt className="admin-sidebar__icon" />
                    <span>Reservas</span>
                </Link>

                <Link 
                    to="/admin/tables" 
                    className={`admin-sidebar__item ${isActive('/admin/tables')}`}
                >
                    <FaChair className="admin-sidebar__icon" />
                    <span>Mesas</span>
                </Link>

                <Link 
                    to="/admin/shifts" 
                    className={`admin-sidebar__item ${isActive('/admin/shifts')}`}
                >
                    <FaCalendarAlt className="admin-sidebar__icon" />
                    <span>Turnos</span>
                </Link>

                <div className={`admin-sidebar__section ${expandedSection === 'maps' ? 'admin-sidebar__section--expanded' : ''}`}>
                    <button 
                        className="admin-sidebar__section-header"
                        onClick={() => toggleSection('maps')}
                    >
                        <FaMap className="admin-sidebar__icon" />
                        <span>Mapas</span>
                    </button>
                    
                    <div className="admin-sidebar__section-content">
                        <Link 
                            to="/admin/zones" 
                            className={`admin-sidebar__subitem ${isActive('/admin/zones')}`}
                        >
                            <span>Zonas</span>
                        </Link>
                        <Link 
                            to="/admin/maps" 
                            className={`admin-sidebar__subitem ${isActive('/admin/maps')}`}
                        >
                            <span>Distribución</span>
                        </Link>
                    </div>
                </div>

                <Link 
                    to="/admin/settings" 
                    className={`admin-sidebar__item ${isActive('/admin/settings')}`}
                >
                    <FaCog className="admin-sidebar__icon" />
                    <span>Configuración</span>
                </Link>
            </nav>
        </div>
    );
};

export default AdminSidebar;
