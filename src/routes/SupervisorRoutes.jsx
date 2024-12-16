import { Route, Routes } from 'react-router-dom'
import Dashboard from '../views/supervisor/dashboard/Dashboard'
import Reservations from '../views/supervisor/reservations/Reservations'
import Tables from '../views/supervisor/tables/Tables'
import Users from '../views/supervisor/users/Users'
import Settings from '../views/supervisor/settings/Settings'
import { RequireAuth } from '../components/session/RequireAuth/RequireAuth'

const SupervisorRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <RequireAuth allowedRoles={['supervisor']}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/reservations"
        element={
          <RequireAuth allowedRoles={['supervisor']}>
            <Reservations />
          </RequireAuth>
        }
      />
      <Route
        path="/tables"
        element={
          <RequireAuth allowedRoles={['supervisor']}>
            <Tables />
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth allowedRoles={['supervisor']}>
            <Users />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth allowedRoles={['supervisor']}>
            <Settings />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default SupervisorRoutes
