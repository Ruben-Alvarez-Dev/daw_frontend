import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = async (date = null) => {
    if (!token) return;
    setLoading(true);
    try {
      const url = date 
        ? `http://localhost:8000/api/reservations/date/${date}`
        : 'http://localhost:8000/api/reservations';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar reservas');
      const data = await response.json();
      setReservations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReservations = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar mis reservas');
      const data = await response.json();
      setReservations(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTables = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/tables', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar las mesas');
      const data = await response.json();
      setAvailableTables(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createReservation = async (reservationData) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) throw new Error('Error al crear la reserva');
      const data = await response.json();
      setReservations(prev => [...prev, data]);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id, updateData) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) throw new Error('Error al actualizar la reserva');
      const updatedReservation = await response.json();
      setReservations(prev => 
        prev.map(res => res.id === id ? updatedReservation : res)
      );
      setError(null);
      return updatedReservation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAvailableTables();
    }
  }, [token]);

  const value = {
    reservations,
    availableTables,
    loading,
    error,
    fetchReservations,
    fetchMyReservations,
    fetchAvailableTables,
    createReservation,
    updateReservation
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations debe usarse dentro de ReservationProvider');
  }
  return context;
};
