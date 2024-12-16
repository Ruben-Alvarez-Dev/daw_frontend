import { useState } from 'react'
import './Navbar.css'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { useSession } from '../../session/SessionManager/SessionManager'
import ActivityTimer from '../../session/ActivityTimer/ActivityTimer'
import SessionTimer from '../../session/SessionTimer/SessionTimer'
import Label from '../../ui/Label/Label'
import Button from '../../ui/Button/Button'
import { FiInfo, FiUser } from 'react-icons/fi'
import Login from '../../auth/Login/Login'
import Register from '../../auth/Register/Register'

const Navbar = () => {
    const { isAuthenticated, logout, user, token } = useAuth()
    const { lastActivity } = useSession()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    DAW Frontend
                </div>
                <div className="navbar-menu">Navbar Menu</div>
                <div className="navbar-menu">Navbar Context</div>
                <div className="navbar-auth">
                    {isAuthenticated && token && (
                        <>
                            <ActivityTimer />
                            <SessionTimer token={token} />
                        </>
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

            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {showRegister && <Register onClose={() => setShowRegister(false)} />}
        </>
    )
}

export default Navbar