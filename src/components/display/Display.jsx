import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Home from '../layout/Home/Home';
import AdminLayout from '../admin/AdminLayout/AdminLayout';
import CustomerDisplay from '../customer/CustomerDisplay';
import './Display.css';

export default function Display() {
    const { user } = useAuth();
    
    return (
        <div className="display">
            <div className="display-content">
                {!user && <Home />}
                {user?.role === 'admin' && <AdminLayout />}
                {user?.role === 'customer' && <CustomerDisplay />}
            </div>
        </div>
    );
}
