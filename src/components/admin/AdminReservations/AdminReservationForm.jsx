import { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import './AdminReservationForm.css';

export default function AdminReservationForm({ reservation, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData(reservation);
    } else {
      setFormData({
        date: '',
        time: '',
        guests: '',
        name: '',
        phone: '',
        email: '',
        notes: ''
      });
    }
  }, [reservation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      date: '',
      time: '',
      guests: '',
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="admin-reservation-form">
      <div className="form-group">
        <label htmlFor="date">Fecha</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Hora</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="guests">Número de Comensales</label>
        <input
          type="number"
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notas</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-actions">
        <Button 
          type="submit" 
          variant="success" 
          label={reservation ? "Actualizar Reserva" : "Crear Reserva"}
        />
        {reservation && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            label="Cancelar"
          />
        )}
      </div>
    </form>
  );
}
