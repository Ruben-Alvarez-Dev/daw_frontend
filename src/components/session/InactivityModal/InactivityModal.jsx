import { useEffect } from 'react'
import './InactivityModal.css'
import Button from '../../ui/Button/Button'

const InactivityModal = ({ timeLeft, onStayActive, onLogout }) => {
    useEffect(() => {
        if (timeLeft <= 0) {
            onLogout()
        }
    }, [timeLeft, onLogout])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    return (
        <div className="inactivity-overlay">
            <div className="inactivity-modal">
                <div className="inactivity-modal-header">
                    <h3>¡ATENCIÓN! Sesión Inactiva</h3>
                </div>
                <div className="inactivity-modal-body">
                    <p>¡Su sesión ha estado inactiva durante 10 minutos!</p>
                    <p>Por seguridad, la sesión se cerrará automáticamente en:</p>
                    <div className="countdown-timer">
                        {formatTime(timeLeft)}
                    </div>
                    <p>Haga clic en el botón para mantener su sesión activa</p>
                    <Button
                        title="Continuar en la web"
                        variant="danger"
                        onClick={onStayActive}
                    />
                </div>
            </div>
        </div>
    )
}

export default InactivityModal
