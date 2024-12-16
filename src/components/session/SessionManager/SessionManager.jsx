import { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import InactivityModal from '../InactivityModal/InactivityModal'
import './SessionManager.css'

const INACTIVITY_TIME = 10 * 60 * 1000 // 10 minutos en milisegundos
const MODAL_COUNTDOWN = 2 * 60 // 2 minutos en segundos

export const SessionContext = createContext(null)

export const useSession = () => {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider')
    }
    return context
}

const SessionManager = ({ children }) => {
    const { token, logout, refreshToken } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [timeLeft, setTimeLeft] = useState(MODAL_COUNTDOWN)
    const [isInactive, setIsInactive] = useState(false)
    const [lastActivity, setLastActivity] = useState(Date.now())

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Error durante logout:', error)
        } finally {
            setShowModal(false)
            setIsInactive(false)
        }
    }

    const handleForceInactivity = () => {
        setIsInactive(true)
        setShowModal(true)
        setTimeLeft(MODAL_COUNTDOWN)
    }

    const updateLastActivity = () => {
        setLastActivity(Date.now())
    }

    // Efecto para detectar inactividad
    useEffect(() => {
        let inactivityTimer = null
        
        const resetInactivityTimer = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer)
            updateLastActivity()
            inactivityTimer = setTimeout(() => {
                setIsInactive(true)
                setShowModal(true)
            }, INACTIVITY_TIME)
        }

        // Solo queremos clicks y teclas, no movimiento del ratón
        const events = ['mousedown', 'keypress']
        events.forEach(event => document.addEventListener(event, resetInactivityTimer))
        window.addEventListener('forceInactivity', handleForceInactivity)
        resetInactivityTimer()

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer)
            events.forEach(event => document.removeEventListener(event, resetInactivityTimer))
            window.removeEventListener('forceInactivity', handleForceInactivity)
        }
    }, [])

    // Efecto para el countdown
    useEffect(() => {
        let countdownTimer = null

        if (showModal && isInactive) {
            countdownTimer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer)
                        handleLogout()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (countdownTimer) {
                clearInterval(countdownTimer)
            }
        }
    }, [showModal, isInactive])

    const handleStayActive = async () => {
        try {
            // Refrescar el token
            console.log('Intentando refrescar token desde SessionManager...') // Debug
            const result = await refreshToken()
            console.log('Resultado del refresh:', result) // Debug
            
            if (!result.success) {
                throw new Error('No se pudo refrescar el token')
            }
            console.log('Token refrescado exitosamente en SessionManager') // Debug
        } catch (error) {
            console.error('Error al refrescar el token:', error)
        } finally {
            // Siempre actualizamos los estados, incluso si falla el refresh
            setShowModal(false)
            setIsInactive(false)
            setTimeLeft(MODAL_COUNTDOWN)
            updateLastActivity()
        }
    }

    return (
        <SessionContext.Provider value={{ 
            isInactive,
            showModal,
            setShowModal,
            timeLeft,
            setTimeLeft,
            handleStayActive,
            handleForceInactivity,
            lastActivity
        }}>
            {children}
            {showModal && (
                <InactivityModal
                    timeLeft={timeLeft}
                    onStayActive={handleStayActive}
                    onLogout={handleLogout}
                />
            )}
        </SessionContext.Provider>
    )
}

export default SessionManager