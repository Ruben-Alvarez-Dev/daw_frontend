import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import './Display.css'

// Admin Views
import AdminDashboard from '../../../views/admin/dashboard/Dashboard'
import AdminReservations from '../../../views/admin/reservations/Reservations'
import AdminRestaurants from '../../../views/admin/restaurants/Restaurants'
import AdminTables from '../../../views/admin/tables/Tables'
import AdminUsers from '../../../views/admin/users/Users'
import AdminSettings from '../../../views/admin/settings/Settings'

// Supervisor Views
import SupervisorDashboard from '../../../views/supervisor/dashboard/Dashboard'
import SupervisorReservations from '../../../views/supervisor/reservations/Reservations'
import SupervisorTables from '../../../views/supervisor/tables/Tables'
import SupervisorUsers from '../../../views/supervisor/users/Users'
import SupervisorSettings from '../../../views/supervisor/settings/Settings'

// Customer Views
import CustomerDashboard from '../../../views/customer/dashboard/Dashboard'
import CustomerReservations from '../../../views/customer/reservations/Reservations'
import CustomerSettings from '../../../views/customer/settings/Settings'

const Display = () => {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  return (
    <div className="display">
      <Routes>
        {/* Admin Routes */}
        {role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/tables" element={<AdminTables />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </>
        )}

        {/* Supervisor Routes */}
        {role === 'supervisor' && (
          <>
            <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
            <Route path="/supervisor/reservations" element={<SupervisorReservations />} />
            <Route path="/supervisor/tables" element={<SupervisorTables />} />
            <Route path="/supervisor/users" element={<SupervisorUsers />} />
            <Route path="/supervisor/settings" element={<SupervisorSettings />} />
          </>
        )}

        {/* Customer Routes */}
        {role === 'customer' && (
          <>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/reservations" element={<CustomerReservations />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default Display