import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTable } from '../../context/TableContext';
import '../../../src/styles/admin.css';

const AdminTableList = forwardRef(({ onEdit, selectedId }, ref) => {
  const { tables, loading, error, fetchTables, deactivateTable } = useTable();
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchTables(showInactive);
  }, [fetchTables, showInactive]);

  useImperativeHandle(ref, () => ({
    refresh: () => fetchTables(showInactive)
  }));

  const handleDeactivate = async (id) => {
    try {
      await deactivateTable(id);
      fetchTables(showInactive);
    } catch (err) {
      console.error('Error deactivating table:', err);
    }
  };

  const translateStatus = (activeUntil) => {
    if (!activeUntil) return { text: 'Activa', class: 'admin-item__status--active' };
    const now = new Date();
    const until = new Date(activeUntil);
    return now > until 
      ? { text: 'Inactiva', class: 'admin-item__status--inactive' }
      : { text: 'Activa hasta ' + until.toLocaleDateString(), class: 'admin-item__status--pending' };
  };

  const filteredTables = tables.filter(table => {
    if (!showInactive) {
      return !table.active_until || new Date(table.active_until) > new Date();
    }
    return true;
  });

  if (loading) return <div className="admin-list">Cargando mesas...</div>;

  return (
    <div className="admin-list">
      <div className="admin-list__header">
        <h2 className="admin-list__title">Lista de Mesas</h2>
        <div className="admin-list__controls">
          <label className="admin-list__checkbox-label">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="admin-list__checkbox"
            />
            Mostrar inactivas
          </label>
        </div>
      </div>

      {error && <div className="admin-list__error">{error}</div>}
      
      <ul className="admin-list__items">
        {filteredTables.map(table => {
          const status = translateStatus(table.active_until);
          const isInactive = table.active_until && new Date(table.active_until) < new Date();
          const isSelected = selectedId === table.id;
          
          return (
            <li key={table.id} className={`admin-item ${isInactive ? 'admin-item--inactive' : ''} ${isSelected ? 'admin-item--selected' : ''}`}>
              <div className="admin-item__info">
                <h3 className="admin-item__name">
                  {table.name} <span className="admin-item__id">(ID: {table.id})</span>
                </h3>
                <p className="admin-item__details">
                  Capacidad: {table.capacity} personas |
                  <span className={`admin-item__status ${status.class}`}> Estado: {status.text}</span>
                </p>
              </div>
              <div className="admin-item__actions">
                <button
                  onClick={() => onEdit(table)}
                  className="admin-item__action admin-item__action--edit"
                >
                  Editar
                </button>
                {!isInactive && (
                  <button
                    onClick={() => handleDeactivate(table.id)}
                    className="admin-item__action admin-item__action--deactivate"
                  >
                    Desactivar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

AdminTableList.displayName = 'AdminTableList';

export default AdminTableList;
