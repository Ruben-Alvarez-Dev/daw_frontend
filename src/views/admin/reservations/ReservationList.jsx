import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
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
    fetchReservations()
  }, [token])

  const fetchReservations = async () => {
    if (!token) {
      setError('No hay sesión activa')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      // Si el token expiró, intentar refrescarlo
      if (response.status === 401) {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          // Reintentar con el nuevo token
          return fetchReservations()
        } else {
          throw new Error('Sesión expirada. Por favor, vuelva a iniciar sesión.')
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cargar reservas')
      }

      const data = await response.json()
      console.log('Respuesta API reservas:', data) // Debug
      
      // Manejar diferentes estructuras de respuesta
      let reservationsArray = []
      if (Array.isArray(data)) {
        reservationsArray = data
      } else if (data.data && Array.isArray(data.data)) {
        reservationsArray = data.data
      } else if (typeof data === 'object') {
        reservationsArray = [data]
      }

      console.log('Reservas procesadas:', reservationsArray) // Debug
      setReservations(reservationsArray)
      setError(null)
    } catch (err) {
      console.error('Error fetchReservations:', err)
      setError(err.message || 'Error al cargar la lista de reservas')
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
