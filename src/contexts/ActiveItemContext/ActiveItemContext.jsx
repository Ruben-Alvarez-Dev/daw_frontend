import { createContext, useContext, useState } from 'react'

const ActiveItemContext = createContext()

export const useActiveItem = () => {
  const context = useContext(ActiveItemContext)
  if (!context) {
    throw new Error('useActiveItem must be used within an ActiveItemProvider')
  }
  return context
}

export const ActiveItemProvider = ({ children }) => {
  const [activeItems, setActiveItems] = useState({
    user: null,
    restaurant: null,
    table: null,
    reservation: null
  })

  const setActiveItem = (type, item) => {
    setActiveItems(prev => ({
      ...prev,
      [type]: item
    }))
  }

  const clearActiveItem = (type) => {
    setActiveItems(prev => ({
      ...prev,
      [type]: null
    }))
  }

  const clearAllActiveItems = () => {
    setActiveItems({
      user: null,
      restaurant: null,
      table: null,
      reservation: null
    })
  }

  return (
    <ActiveItemContext.Provider value={{
      activeItems,
      setActiveItem,
      clearActiveItem,
      clearAllActiveItems
    }}>
      {children}
    </ActiveItemContext.Provider>
  )
}

export default ActiveItemContext
