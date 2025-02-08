import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerDashboard from './Dashboard/CustomerDashboard';
import CustomerProfile from './Profile/CustomerProfile';
import CustomerLayout from './CustomerLayout/CustomerLayout';

export default function CustomerDisplay() {
    return (
        <CustomerLayout>
            <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="profile" element={<CustomerProfile />} />
            </Routes>
        </CustomerLayout>
    );
}
