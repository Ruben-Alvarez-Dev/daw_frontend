import PropTypes from 'prop-types';
import '../../styles/shared/crud.css';

export default function CrudList({ 
  items, 
  renderItem, 
  error 
}) {
  if (!items || !Array.isArray(items)) {
    return <div>No hay elementos para mostrar</div>;
  }

  return (
    <div className="crud-list">
      {error && (
        <div className="crud-form bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="crud-items">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
}

CrudList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  })).isRequired,
  renderItem: PropTypes.func.isRequired,
  error: PropTypes.string
};
