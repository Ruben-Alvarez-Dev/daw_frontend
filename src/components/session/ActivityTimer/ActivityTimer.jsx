import { useState, useEffect } from 'react'
import Label from '../../ui/Label/Label'
import { FiActivity } from 'react-icons/fi'
import { useSession } from '../SessionManager/SessionManager'

const INACTIVITY_WARNING_TIME = 10 * 60 * 1000 // 10 minutos en milisegundos

const ActivityTimer = () => {
    const [timeLeft, setTimeLeft] = useState('')
    const { lastActivity, handleForceInactivity } = useSession()
    const [hasTriggeredInactivity, setHasTriggeredInactivity] = useState(false)

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now()
            const inactiveTime = now - lastActivity
            const timeLeftMs = INACTIVITY_WARNING_TIME - inactiveTime
            
            if (timeLeftMs <= 0) {
                setTimeLeft('Inactivo')
                if (!hasTriggeredInactivity) {
                    handleForceInactivity()
                    setHasTriggeredInactivity(true)
                }
                return false
            }

            // Reset el flag cuando hay actividad
            if (hasTriggeredInactivity && timeLeftMs > 0) {
                setHasTriggeredInactivity(false)
            }

            const minutes = Math.floor(timeLeftMs / 60000)
            const seconds = Math.floor((timeLeftMs % 60000) / 1000)
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
            
            setTimeLeft(timeString)
            return true
        }

        updateTimer()
        const timer = setInterval(updateTimer, 1000)
        return () => clearInterval(timer)
    }, [lastActivity, handleForceInactivity, hasTriggeredInactivity])

    if (!timeLeft) return null

    return (
        <Label 
            text={`Actividad: ${timeLeft}`}
            variant="label-info"
            icon={<FiActivity />}
        />
    )
}

export default ActivityTimer
