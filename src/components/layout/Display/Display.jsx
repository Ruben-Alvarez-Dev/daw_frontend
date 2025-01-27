import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../../auth/Login';
import Register from '../../auth/Register';
import CustomerDashboard from '../../customer/CustomerDashboard';
import AdminDashboard from '../../admin/AdminDashboard';
import PrivateRoute from '../../auth/PrivateRoute';
import Home from '../Home/Home';
import './Display.css';

export default function Display() {
  const location = useLocation();
  const showModal = location.pathname === '/login' || location.pathname === '/register';
  const showHome = location.pathname === '/' || showModal;

  return (
    <main className="display">
      {showHome && <Home />}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
