// src/components/layout/Footer/Footer.jsx
import { useState, useEffect } from 'react'
import './Footer.css'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import ActivityTimer from '../../session/ActivityTimer/ActivityTimer'
import SessionTimer from '../../session/SessionTimer/SessionTimer'
import Label from '../../ui/Label/Label'
import { FiClock, FiCalendar } from 'react-icons/fi'

const Footer = () => {
  const { token } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <footer className="footer">
        {token && (
          <>
            <ActivityTimer />
            <SessionTimer token={token} />
          </>
        )}
        <Label 
          text={formatDate(currentTime)}
          variant="label-default"
          icon={<FiCalendar />}
        />
        <Label 
          text={formatTime(currentTime)}
          variant="label-default"
          icon={<FiClock />}
        />

    </footer>
  )
}

export default Footer