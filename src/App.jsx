import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout'
import Login from './components/Login'
import Tables from './components/Tables'
import Users from './components/Users'
import Reservations from './components/Reservations'
import './styles/components.css'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Tables />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
