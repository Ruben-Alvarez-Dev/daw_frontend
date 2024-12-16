import { Route, Routes } from 'react-router-dom'
import Login from '../views/auth/Login/Login'
import Register from '../views/auth/Register/Register'
import ForgotPassword from '../views/auth/ForgotPassword/ForgotPassword'
import ResetPassword from '../views/auth/ResetPassword/ResetPassword'

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default AuthRoutes
