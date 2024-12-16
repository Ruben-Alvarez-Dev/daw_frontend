import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext/AuthContext'
import AdminRoutes from './AdminRoutes'
import SupervisorRoutes from './SupervisorRoutes'
import CustomerRoutes from './CustomerRoutes'
import AuthRoutes from './AuthRoutes'
import Dashboard from '../views/dashboard/Dashboard'
import { RequireAuth } from '../components/session/RequireAuth/RequireAuth'

const AppRoutes = () => {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  return (
    <Routes>
      {/* Ruta raíz redirige según el rol */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={`/${role || 'auth'}/dashboard`} 
            replace 
          />
        } 
      />

      {/* Rutas por rol */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/supervisor/*" element={<SupervisorRoutes />} />
      <Route path="/customer/*" element={<CustomerRoutes />} />

      {/* Rutas de autenticación */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Ruta 404 - Not Found */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={`/${role || 'auth'}/dashboard`} 
            replace 
          />
        } 
      />
    </Routes>
  )
}

export default AppRoutes
