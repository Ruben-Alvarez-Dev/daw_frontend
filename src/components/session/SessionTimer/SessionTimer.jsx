import { useEffect, useState } from 'react'
import { useSession } from '../SessionManager/SessionManager'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Modal from '../../ui/Modal/Modal'
import Label from '../../ui/Label/Label'
import { FiClock } from 'react-icons/fi'
import Button from '../../ui/Button/Button'

const TWO_MINUTES = 2 * 60 * 1000 // 2 minutos en milisegundos

const SessionTimer = () => {
    const { handleStayActive, showModal } = useSession()
    const { logout, token } = useAuth()
    const [tokenTimeLeft, setTokenTimeLeft] = useState('')
    const [showExpirationModal, setShowExpirationModal] = useState(false)
    const [expirationTimeLeft, setExpirationTimeLeft] = useState(60)

    // Timer para el token
    useEffect(() => {
        if (token) {
            console.log('Token actualizado:', token) // Debug
            const updateTokenTimer = () => {
                const tokenData = JSON.parse(atob(token.split('.')[1]))
                const timeLeftMs = (tokenData.exp * 1000) - Date.now()
                
                if (timeLeftMs <= 0) {
                    setTokenTimeLeft('Expirado')
                    logout()
                    return false
                }

                // Mostrar modal cuando quedan 2 minutos, pero solo si no hay otro modal visible
                if (timeLeftMs <= TWO_MINUTES && !showExpirationModal && !showModal) {
                    setShowExpirationModal(true)
                    setExpirationTimeLeft(Math.floor(timeLeftMs / 1000))
                }

                const minutes = Math.floor(timeLeftMs / 60000)
                const seconds = Math.floor((timeLeftMs % 60000) / 1000)
                const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
                setTokenTimeLeft(timeString)
                return true
            }

            // Actualizar inmediatamente
            updateTokenTimer()
            
            // Y luego cada segundo
            const timer = setInterval(updateTokenTimer, 1000)
            return () => clearInterval(timer)
        }
    }, [token, logout, showExpirationModal, showModal]) // Añadido token y showModal a las dependencias

    // Timer para el modal de expiración
    useEffect(() => {
        let timer
        if (showExpirationModal) {
            timer = setInterval(() => {
                setExpirationTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        logout()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [showExpirationModal, logout])

    const handleRefreshSession = () => {
        // Aquí iría la lógica para refrescar el token
        setShowExpirationModal(false)
        handleStayActive()
    }

    return (
        <>
            {token && tokenTimeLeft && (
                <Label 
                    text={`Sesión: ${tokenTimeLeft}`} 
                    variant="label-warning" 
                    icon={<FiClock />} 
                />
            )}
            {showExpirationModal && (
                <Modal
                    title="Sesión por expirar"
                    onClose={() => handleRefreshSession()}
                    footer={
                        <div className="modal-footer">
                            <p>La sesión expirará en {Math.floor(expirationTimeLeft)} segundos</p>
                            <Button
                                title="Renovar sesión"
                                variant="primary"
                                onClick={handleRefreshSession}
                            />
                        </div>
                    }
                >
                    <p>Su sesión está a punto de expirar. ¿Desea renovarla?</p>
                </Modal>
            )}
        </>
    )
}

export default SessionTimer