import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { fetchReservations } from '../../../services/api'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './ReservationList.css'

const ReservationList = ({ onEdit }) => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, refreshToken } = useAuth()

  useEffect(() => {
    loadReservations()
  }, [token])

  const loadReservations = async () => {
    if (!token) {
      setError('No hay sesión activa')
      setLoading(false)
      return
    }

    try {
      const data = await fetchReservations(token)
      setReservations(data)
      setError(null)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadReservations()
        }
        setError('Sesión expirada. Por favor, vuelva a iniciar sesión.')
      } else {
        setError(err.message)
      }
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (reservation) => {
    if (onEdit) onEdit(reservation)
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }

  const renderReservationItem = (reservation) => (
    <>
      <div className="reservation-primary">
        <span className="reservation-restaurant">{reservation.restaurant?.name || 'Restaurante no disponible'}</span>
      </div>
      <div className="reservation-secondary">
        <span className="reservation-datetime">{formatDateTime(reservation.datetime)}</span>
        <span className="reservation-tables">
          Mesas: {Array.isArray(reservation.tables) ? reservation.tables.join(', ') : 'No asignadas'}
        </span>
      </div>
      <div className="reservation-tertiary">
        <span className="reservation-user">{reservation.user?.name || 'Usuario no disponible'}</span>
        <span className="reservation-status" data-status={reservation.status}>{reservation.status}</span>
      </div>
    </>
  )

  const renderReservationList = () => {
    if (loading) return <p className="loading-message">Cargando reservas...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!reservations || reservations.length === 0) return <p className="empty-message">No hay reservas registradas</p>

    return (
      <List
        items={reservations}
        renderItem={renderReservationItem}
        threeLines={true}
      />
    )
  }

  return (
    <Card
      card-header={<h3>Lista de Reservas</h3>}
      card-body={renderReservationList()}
      card-footer={
        <Button 
          title="Nuevo" 
          variant="primary" 
          onClick={() => handleEdit(null)}
        />
      }
    />
  )
}

export default ReservationList
