import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../utils/api'
import ReservationList from './ReservationList'
import ReservationForm from './ReservationForm'

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchWithAuth('http://localhost:8000/api/reservations')
      setReservations(data)
    } catch (err) {
      console.error('Error fetching reservations:', err)
      setError('Failed to fetch reservations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleCreate = async (reservationData) => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors({})

      await fetchWithAuth('http://localhost:8000/api/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData)
      })

      setSelectedReservation(null)
      await fetchReservations()
    } catch (err) {
      console.error('Error creating reservation:', err)
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors)
      } else {
        setError(err.message || 'Failed to create reservation')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (reservationData) => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors({})

      await fetchWithAuth(`http://localhost:8000/api/reservations/${selectedReservation.id}`, {
        method: 'PUT',
        body: JSON.stringify(reservationData)
      })

      setSelectedReservation(null)
      await fetchReservations()
    } catch (err) {
      console.error('Error updating reservation:', err)
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors)
      } else {
        setError(err.message || 'Failed to update reservation')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reservationId) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        setLoading(true)
        setError(null)
        
        await fetchWithAuth(`http://localhost:8000/api/reservations/${reservationId}`, {
          method: 'DELETE'
        })

        setSelectedReservation(null)
        await fetchReservations()
      } catch (err) {
        console.error('Error deleting reservation:', err)
        setError('Failed to delete reservation')
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="users-container">
      <div className="users-layout">
        <div className="list-section">
          <ReservationList
            reservations={reservations}
            selectedReservation={selectedReservation}
            onSelectReservation={setSelectedReservation}
            onCreateNew={() => setSelectedReservation({})}
          />
        </div>
        <div className="form-section">
          {(selectedReservation || selectedReservation === {}) && (
            <ReservationForm
              reservation={selectedReservation?.id ? selectedReservation : null}
              onSubmit={selectedReservation?.id ? handleUpdate : handleCreate}
              onCancel={() => setSelectedReservation(null)}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Reservations
