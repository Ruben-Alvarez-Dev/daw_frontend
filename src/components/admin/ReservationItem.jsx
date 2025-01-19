import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ReservationItem({ reservation, selected, onClick }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = reservation.user_id || reservation.userId || reservation.id;

      if (!userId) {
        console.log('No se encontró ID de usuario en la reserva:', reservation);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [reservation, token]);

  return (
    <div 
      className={`distribution-reservation ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="reservation-time">{reservation.time}</span>
      <span className="reservation-guests">{reservation.guests} pax</span>
      <span className="reservation-status">{reservation.status}</span>
      <div className="reservation-user">
        {loading ? (
          <span>Cargando...</span>
        ) : userData ? (
          <>
            <span>{userData.name || 'Sin nombre'}</span>
            <span>{userData.phone || 'Sin teléfono'}</span>
            <span>{userData.email || 'Sin email'}</span>
          </>
        ) : (
          <span>Error al cargar datos del usuario</span>
        )}
      </div>
    </div>
  );
}
