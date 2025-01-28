import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../../auth/Login';
import Register from '../../auth/Register';
import CustomerDisplay from '../../customer/CustomerDisplay';
import AdminDisplay from '../../admin/AdminDisplay/AdminDisplay.jsx';
import PrivateRoute from '../../auth/PrivateRoute';
import Home from '../Home/Home';
import './Display.css';

export default function Display() {
  const location = useLocation();
  const showModal = location.pathname === '/login' || location.pathname === '/register';
  const showHome = location.pathname === '/' || showModal;
  const showAdmin = location.pathname === '/admin';

  return (
    <main className="display">
      {showHome && <Home />}
      {showAdmin && (
        <PrivateRoute requireAdmin={true}>
          <AdminDisplay />
        </PrivateRoute>
      )}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <CustomerDisplay />
          </PrivateRoute>
        } />
      </Routes>
    </main>
  );
}
