import { Outlet, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { clearAuthToken } from '../utils/api'
import './Layout.css'

function Layout() {
  const { isAuthenticated, setIsAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Restaurant Manager</h1>
        <div className="nav-links">
          <Link to="/">Tables</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/users">Users</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
