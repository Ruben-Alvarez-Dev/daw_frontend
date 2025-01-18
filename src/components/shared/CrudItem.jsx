import PropTypes from 'prop-types';
import '../../styles/shared/crud.css';

export default function CrudItem({ fields, onEdit, onDelete }) {
  if (!fields || !Array.isArray(fields)) {
    console.warn('CrudItem: fields debe ser un array');
    return null;
  }

  return (
    <div className="crud-item">
      <div className="crud-item-content">
        {fields.map(({ label, value }, index) => (
          <div key={index} className="crud-item-field">
            <div className="crud-item-label">{label}</div>
            <div className="crud-item-value">{value || '-'}</div>
          </div>
        ))}
      </div>
      <div className="crud-buttons">
        {onEdit && (
          <button 
            className="crud-button crud-button-secondary"
            onClick={onEdit}
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button 
            className="crud-button crud-button-danger"
            onClick={onDelete}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

CrudItem.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired
  })).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};
