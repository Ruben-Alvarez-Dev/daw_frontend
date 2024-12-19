import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { fetchUsers, fetchRestaurants, fetchTables, fetchReservations } from '../../services/api'
import { useAuth } from '../AuthContext/AuthContext'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const { token, refreshToken } = useAuth()

  // Active items state
  const [activeItems, setActiveItems] = useState({
    user: null,
    restaurant: null,
    table: null,
    reservation: null
  })

  // Data state
  const [data, setData] = useState({
    users: [],
    restaurants: [],
    tables: [],
    reservations: []
  })

  // Loading states
  const [loading, setLoading] = useState({
    users: false,
    restaurants: false,
    tables: false,
    reservations: false
  })

  // Error states
  const [errors, setErrors] = useState({
    users: null,
    restaurants: null,
    tables: null,
    reservations: null
  })

  // Active items actions
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

  // Data loading actions
  const loadUsers = async () => {
    if (!token) return
    
    setLoading(prev => ({ ...prev, users: true }))
    setErrors(prev => ({ ...prev, users: null }))

    try {
      const userData = await fetchUsers(token)
      setData(prev => ({ ...prev, users: userData }))
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadUsers()
        }
      }
      setErrors(prev => ({ ...prev, users: err.message }))
      setData(prev => ({ ...prev, users: [] }))
    } finally {
      setLoading(prev => ({ ...prev, users: false }))
    }
  }

  const loadRestaurants = async () => {
    if (!token) return
    
    setLoading(prev => ({ ...prev, restaurants: true }))
    setErrors(prev => ({ ...prev, restaurants: null }))

    try {
      const restaurantData = await fetchRestaurants(token)
      setData(prev => ({ ...prev, restaurants: restaurantData }))
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadRestaurants()
        }
      }
      setErrors(prev => ({ ...prev, restaurants: err.message }))
      setData(prev => ({ ...prev, restaurants: [] }))
    } finally {
      setLoading(prev => ({ ...prev, restaurants: false }))
    }
  }

  const loadTables = async () => {
    if (!token) return
    
    setLoading(prev => ({ ...prev, tables: true }))
    setErrors(prev => ({ ...prev, tables: null }))

    try {
      const tableData = await fetchTables(token)
      setData(prev => ({ ...prev, tables: tableData }))
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadTables()
        }
      }
      setErrors(prev => ({ ...prev, tables: err.message }))
      setData(prev => ({ ...prev, tables: [] }))
    } finally {
      setLoading(prev => ({ ...prev, tables: false }))
    }
  }

  const loadReservations = async () => {
    if (!token) return
    
    setLoading(prev => ({ ...prev, reservations: true }))
    setErrors(prev => ({ ...prev, reservations: null }))

    try {
      const reservationData = await fetchReservations(token)
      setData(prev => ({ ...prev, reservations: reservationData }))
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadReservations()
        }
      }
      setErrors(prev => ({ ...prev, reservations: err.message }))
      setData(prev => ({ ...prev, reservations: [] }))
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }))
    }
  }

  return (
    <AppContext.Provider 
      value={{
        // Active items
        activeItems,
        setActiveItem,
        clearActiveItem,
        clearAllActiveItems,
        
        // Data
        data,
        loading,
        errors,
        
        // Actions
        loadUsers,
        loadRestaurants,
        loadTables,
        loadReservations
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AppContext
