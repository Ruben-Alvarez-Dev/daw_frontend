import { Route, Routes } from 'react-router-dom'
import Dashboard from '../views/admin/dashboard/Dashboard'
import Reservations from '../views/admin/reservations/Reservations'
import Restaurants from '../views/admin/restaurants/Restaurants'
import Tables from '../views/admin/tables/Tables'
import Users from '../views/admin/users/Users'
import Settings from '../views/admin/settings/Settings'
import { RequireAuth } from '../components/session/RequireAuth/RequireAuth'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/reservations"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <Reservations />
          </RequireAuth>
        }
      />
      <Route
        path="/restaurants"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <Restaurants />
          </RequireAuth>
        }
      />
      <Route
        path="/tables"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <Tables />
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <Users />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth allowedRoles={['admin']}>
            <Settings />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default AdminRoutes
