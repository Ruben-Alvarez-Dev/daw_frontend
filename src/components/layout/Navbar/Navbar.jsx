import { useState } from 'react'
import './Navbar.css'
import Button from '../../ui/Button/Button'
import Label from '../../ui/Label/Label'
import { FiInfo, FiUser } from 'react-icons/fi'
import { useAuth } from '../../../context/AuthContext/AuthContext'
import Login from '../../auth/Login/Login'
import Register from '../../auth/Register/Register'

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    console.log('Auth State:', { isAuthenticated, user }) // Para depuración

    return (
      <>
        <nav className="navbar">
          <div className="navbar-brand">
            DAW Frontend
          </div>
          <div className="navbar-menu">Navbar Menu</div>
          <div className="navbar-menu">Navbar Context</div>
          <div className="navbar-auth">
            <Label 
              text={isAuthenticated && user ? user.email : "Info"} 
              variant="label-info" 
              icon={<FiInfo />} 
            />
            {isAuthenticated && user && (
              <Label 
                text={user.role} 
                variant="label-info" 
                icon={<FiUser />} 
              />
            )}
            {isAuthenticated ? (
              <Button 
                title="Logout" 
                variant="danger" 
                onClick={logout} 
              />
            ) : (
              <>
                <Button 
                  title="Login" 
                  variant="primary" 
                  onClick={() => setShowLogin(true)} 
                />
                <Button 
                  title="Register" 
                  variant="success" 
                  onClick={() => setShowRegister(true)} 
                />
              </>
            )}
          </div>
        </nav>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
        {showRegister && <Register onClose={() => setShowRegister(false)} />}
      </>
    )
}

export default Navbar