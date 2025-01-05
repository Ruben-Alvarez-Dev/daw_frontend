import './List.css'

function TableList({ tables, selectedTable, onSelectTable, onCreateNew }) {
  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Tables</h2>
        <button onClick={onCreateNew} className="btn-add">
          Add New Table
        </button>
      </div>
      <div className="list-content">
        {tables.map(table => (
          <div
            key={table.id}
            className={`list-item ${selectedTable?.id === table.id ? 'selected' : ''}`}
            onClick={() => onSelectTable(table)}
          >
            <div className="item-info">
              <span className="item-name">{table.name}</span>
              <span className="item-detail">
                Capacity: {table.capacity} | {table.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableList
