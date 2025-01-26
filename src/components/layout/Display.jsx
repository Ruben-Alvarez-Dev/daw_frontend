import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Home from '../home/Home';
import CustomerDashboard from '../customer/CustomerDashboard';
import AdminRoutes from '../admin/AdminRoutes';
import PrivateRoute from '../auth/PrivateRoute';
import './Display.css';

export default function Display() {
  const { user } = useAuth();

  const getHomeRedirect = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <div className="display">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <CustomerDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
  );
}
