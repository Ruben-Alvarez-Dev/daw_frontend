import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import CustomerDashboard from '../customer/CustomerDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import PrivateRoute from '../auth/PrivateRoute';
import './Display.css';

export default function Display() {
  return (
    <main className="display">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <CustomerDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute requireAdmin={true}>
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </main>
  );
}
