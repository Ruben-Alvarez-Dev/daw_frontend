import { useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import TableList from './TableList'
import TableForm from './TableForm'

function Tables() {
  const {
    tables,
    selectedTable,
    setSelectedTable,
    loading,
    error,
    fetchTables,
    updateTable,
    createTable
  } = useApp();

  useEffect(() => {
    fetchTables()
  }, [])

  if (loading.tables) return <div className="loading">Loading...</div>
  if (error.tables) return <div className="error-message">{error.tables}</div>

  return (
    <div className="users-container">
      <div className="users-layout">
        <div className="list-section">
          <TableList
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
            onCreateNew={() => setSelectedTable({})}
          />
        </div>
        <div className="form-section">
          {(selectedTable || selectedTable === {}) && (
            <TableForm
              table={selectedTable?.id ? selectedTable : null}
              onSubmit={selectedTable?.id ? updateTable : createTable}
              onCancel={() => setSelectedTable(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Tables
