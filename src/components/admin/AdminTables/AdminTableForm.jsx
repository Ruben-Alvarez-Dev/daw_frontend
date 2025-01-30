import { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import './AdminTableForm.css';

export default function AdminTableForm({ table, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    status: 'available'
  });

  useEffect(() => {
    if (table) {
      setFormData(table);
    } else {
      setFormData({
        number: '',
        capacity: '',
        status: 'available'
      });
    }
  }, [table]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      number: '',
      capacity: '',
      status: 'available'
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
    <form onSubmit={handleSubmit} className="admin-table-form">
      <div className="form-group">
        <label htmlFor="number">Número de Mesa</label>
        <input
          type="number"
          id="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacidad</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Estado</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="available">Disponible</option>
          <option value="occupied">Ocupada</option>
          <option value="reserved">Reservada</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
      </div>

      <div className="form-actions">
        <Button 
          type="submit" 
          variant="success" 
          label={table ? "Actualizar Mesa" : "Crear Mesa"}
        />
        {table && (
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
