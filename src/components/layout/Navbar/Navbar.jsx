import { useState, useEffect } from 'react'
import './Navbar.css'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Label from '../../ui/Label/Label'
import Button from '../../ui/Button/Button'
import { FiUser, FiUsers, FiHome, FiGrid, FiCalendar } from 'react-icons/fi'
import Login from '../../auth/Login/Login'
import Register from '../../auth/Register/Register'

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth()
    const { activeItems } = useApp()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    useEffect(() => {
        console.log('Active Items in Navbar:', activeItems)
    }, [activeItems])

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    DAW Frontend
                </div>
                <div className="navbar-menu">Navbar Menu</div>
                <div className="navbar-context">
                    {activeItems.user && (
                        <Label 
                            text={`Usuario: ${activeItems.user.name}`}
                            variant="label-default"
                            icon={<FiUsers />}
                        />
                    )}
                    {activeItems.restaurant && (
                        <Label 
                            text={`Restaurante: ${activeItems.restaurant.name}`}
                            variant="label-default"
                            icon={<FiHome />}
                        />
                    )}
                    {activeItems.table && (
                        <Label 
                            text={`Mesa: ${activeItems.table.number}`}
                            variant="label-default"
                            icon={<FiGrid />}
                        />
                    )}
                    {activeItems.reservation && (
                        <Label 
                            text={`Reserva: ${activeItems.reservation.id}`}
                            variant="label-default"
                            icon={<FiCalendar />}
                        />
                    )}
                </div>
                <div className="navbar-auth">
                    {isAuthenticated && user && (
                        <>
                            <Label 
                                text={user.email} 
                                variant="label-info" 
                                icon={<FiUser />} 
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