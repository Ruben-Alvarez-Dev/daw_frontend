import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { RiDashboardLine, RiCalendarLine, RiStore2Line, RiTableLine, RiUserLine, RiSettings4Line } from 'react-icons/ri'
import './Aside.css'

const Aside = () => {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  const menuItems = {
    admin: [
      { to: '/admin/dashboard', icon: RiDashboardLine, text: 'Dashboard' },
      { to: '/admin/reservations', icon: RiCalendarLine, text: 'Reservations' },
      { to: '/admin/restaurants', icon: RiStore2Line, text: 'Restaurants' },
      { to: '/admin/tables', icon: RiTableLine, text: 'Tables' },
      { to: '/admin/users', icon: RiUserLine, text: 'Users' },
      { to: '/admin/settings', icon: RiSettings4Line, text: 'Settings' }
    ],
    supervisor: [
      { to: '/supervisor/dashboard', icon: RiDashboardLine, text: 'Dashboard' },
      { to: '/supervisor/reservations', icon: RiCalendarLine, text: 'Reservations' },
      { to: '/supervisor/tables', icon: RiTableLine, text: 'Tables' },
      { to: '/supervisor/users', icon: RiUserLine, text: 'Users' },
      { to: '/supervisor/settings', icon: RiSettings4Line, text: 'Settings' }
    ],
    customer: [
      { to: '/customer/dashboard', icon: RiDashboardLine, text: 'Dashboard' },
      { to: '/customer/reservations', icon: RiCalendarLine, text: 'My Reservations' },
      { to: '/customer/settings', icon: RiSettings4Line, text: 'Settings' }
    ]
  }

  const currentMenu = menuItems[role] || []

  if (!user || !currentMenu.length) return null

  return (
    <aside className="aside">
      <nav className="aside-nav">
        {currentMenu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            <span className="nav-text">{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Aside