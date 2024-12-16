import { useState } from 'react'
import './Login.css'
import Button from '../../ui/Button/Button'
import Modal from '../../ui/Modal/Modal'
import { useAuth } from '../../../contexts/AuthContext/AuthContext.jsx'


const Login = ({ onClose }) => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(formData)
    
    if (!result.success) {
      setError(result.error)
    } else {
      onClose?.()
    }
  }

  return (
    <Modal
      modal-header={<h3>Iniciar Sesión</h3>}
      modal-body={
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
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
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      }
      modal-footer={
        <Button 
          title="Iniciar Sesión" 
          variant="primary"
          onClick={handleSubmit}
        />
      }
      onClose={onClose}
    />
  )
}


export default Login