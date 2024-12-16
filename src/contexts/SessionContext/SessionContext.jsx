import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../AuthContext/AuthContext'

const SessionContext = createContext()
const INACTIVITY_TIMEOUT = 1 * 60 * 1000 // 1 minuto en milisegundos (para desarrollo)
const MODAL_COUNTDOWN = 60 // 60 segundos para el modal

export const useSession = () => {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider')
    }
    return context
}

export const SessionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth()
    const [lastActivity, setLastActivity] = useState(Date.now())
    const [showInactivityModal, setShowInactivityModal] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(MODAL_COUNTDOWN)

    // Resetear estado cuando cambia la autenticación
    useEffect(() => {
        if (isAuthenticated) {
            // Si el usuario se acaba de autenticar, inicializar todo
            setLastActivity(Date.now())
            setShowInactivityModal(false)
            setTimeRemaining(MODAL_COUNTDOWN)
        }
    }, [isAuthenticated])

    // Efecto para manejar la actividad del usuario
    useEffect(() => {
        if (!isAuthenticated) return

        const resetActivity = () => {
            if (!showInactivityModal) {
                console.log('Reseteando actividad...')
                setLastActivity(Date.now())
            }
        }

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
        events.forEach(event => window.addEventListener(event, resetActivity))

        return () => {
            events.forEach(event => window.removeEventListener(event, resetActivity))
        }
    }, [isAuthenticated, showInactivityModal])

    // Efecto para verificar inactividad
    useEffect(() => {
        if (!isAuthenticated) return

        const checkInactivity = () => {
            const now = Date.now()
            const inactiveTime = now - lastActivity

            if (inactiveTime >= INACTIVITY_TIMEOUT && !showInactivityModal) {
                console.log('Usuario inactivo, mostrando modal...')
                setShowInactivityModal(true)
                setTimeRemaining(MODAL_COUNTDOWN)
            }
        }

        const timer = setInterval(checkInactivity, 1000)
        return () => clearInterval(timer)
    }, [isAuthenticated, lastActivity, showInactivityModal])

    const resetActivity = () => {
        console.log('Reseteando actividad manualmente...')
        setLastActivity(Date.now())
        setShowInactivityModal(false)
        setTimeRemaining(MODAL_COUNTDOWN)
    }

    const value = {
        lastActivity,
        showInactivityModal,
        setShowInactivityModal,
        timeRemaining,
        setTimeRemaining,
        resetActivity
    }

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}
