import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children, requireAdmin }) {
  const { user, token } = useAuth();
  
  // Verificar tanto el token como la existencia del usuario
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
