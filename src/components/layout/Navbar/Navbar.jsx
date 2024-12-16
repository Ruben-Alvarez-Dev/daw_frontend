import { useState, useEffect } from 'react'
import './Navbar.css'
import Button from '../../ui/Button/Button'
import Label from '../../ui/Label/Label'
import { FiInfo, FiUser, FiClock } from 'react-icons/fi'
import { useAuth } from '../../../context/AuthContext/AuthContext'
import Login from '../../auth/Login/Login'
import Register from '../../auth/Register/Register'

const Navbar = () => {
    const { isAuthenticated, logout, user, token } = useAuth()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        if (token) {
            const updateTimeLeft = () => {
                const tokenData = JSON.parse(atob(token.split('.')[1]))
                const expirationTime = tokenData.exp * 1000
                const currentTime = new Date().getTime()
                const timeLeftMs = expirationTime - currentTime
                
                if (timeLeftMs <= 0) {
                    setTimeLeft('Expirado')
                    return false
                } else {
                    const minutesLeft = Math.floor(timeLeftMs / 60000)
                    const secondsLeft = Math.floor((timeLeftMs % 60000) / 1000)
                    setTimeLeft(`${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`)
                    return true
                }
            }

            // Primera actualización
            updateTimeLeft()

            // Actualizar cada segundo
            const timer = setInterval(() => {
                const shouldContinue = updateTimeLeft()
                if (!shouldContinue) clearInterval(timer)
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [token])

    return (
      <>
        <nav className="navbar">
          <div className="navbar-brand">
            DAW Frontend
          </div>
          <div className="navbar-menu">Navbar Menu</div>
          <div className="navbar-menu">Navbar Context</div>
          <div className="navbar-auth">
            {isAuthenticated && token && timeLeft && (
              <Label 
                text={timeLeft} 
                variant="label-warning" 
                icon={<FiClock />} 
              />
            )}
            {isAuthenticated && user && (
              <>
                <Label 
                  text={user.email} 
                  variant="label-info" 
                  icon={<FiInfo />} 
                />
                <Label 
                  text={user.role} 
                  variant="label-info" 
                  icon={<FiUser />} 
                />
              </>
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

        {showLogin && (
          <Login onClose={() => setShowLogin(false)} />
        )}
        
        {showRegister && (
          <Register onClose={() => setShowRegister(false)} />
        )}
      </>
    )
}

export default Navbar