import { Route, Routes } from 'react-router-dom'
import Dashboard from '../views/customer/dashboard/Dashboard'
import Reservations from '../views/customer/reservations/Reservations'
import Settings from '../views/customer/settings/Settings'
import { RequireAuth } from '../components/session/RequireAuth/RequireAuth'

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <RequireAuth allowedRoles={['customer']}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/reservations"
        element={
          <RequireAuth allowedRoles={['customer']}>
            <Reservations />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth allowedRoles={['customer']}>
            <Settings />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default CustomerRoutes
