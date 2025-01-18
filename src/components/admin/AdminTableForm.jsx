import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminTableForm.css';

export default function AdminTableForm({ onTableCreated, editingTable }) {
  const [formData, setFormData] = useState({
    capacity: '',
    name: ''
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (editingTable) {
      setFormData({
        capacity: editingTable.capacity,
        name: editingTable.name || ''
      });
    } else {
      setFormData({
        capacity: '',
        name: ''
      });
    }
  }, [editingTable]);

  const clearForm = () => {
    setFormData({
      capacity: '',
      name: ''
    });
    setError('');
    
    // Si estamos en modo edición, notificar al padre para salir de ese modo
    if (editingTable && onTableCreated) {
      onTableCreated();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingTable
        ? `http://localhost:8000/api/tables/${editingTable.id}`
        : 'http://localhost:8000/api/tables';

      const method = editingTable ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la mesa');
      }

      setFormData({
        capacity: '',
        name: ''
      });

      if (onTableCreated) {
        onTableCreated();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-table-form">
      <h3>{editingTable ? 'Editar Mesa' : 'Nueva Mesa'}</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="number"
            placeholder="Capacidad"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">
            {editingTable ? 'Actualizar Mesa' : 'Crear Mesa'}
          </button>
          <button type="button" onClick={clearForm} className="clear-button">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
