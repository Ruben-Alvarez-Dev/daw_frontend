import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Navbar />
            <div className="admin-layout__container">
                <AdminSidebar />
                <main className="admin-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
