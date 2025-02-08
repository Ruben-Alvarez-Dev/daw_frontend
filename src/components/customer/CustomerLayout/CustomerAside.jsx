import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CustomerAside.css';

export default function CustomerAside() {
    const location = useLocation();
    const path = location.pathname;

    const isActive = (route) => {
        return path.includes(route) ? 'active' : '';
    };

    return (
        <aside className="customer-aside">
            <nav className="customer-aside__nav">
                <Link
                    to="/customer/dashboard"
                    className={`customer-aside__link ${isActive('dashboard')}`}
                >
                    Mis Reservas
                </Link>
                <Link
                    to="/customer/profile"
                    className={`customer-aside__link ${isActive('profile')}`}
                >
                    Mi Perfil
                </Link>
            </nav>
        </aside>
    );
}
