import { useState } from 'react'
import './Register.css'
import Button from '../../ui/Button/Button'
import Modal from '../../ui/Modal/Modal'
import { useAuth } from '../../../context/AuthContext/AuthContext'

const Register = ({ onClose }) => {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
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
    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    const result = await register(formData)
    if (!result.success) {
      setError(result.error)
    } else {
      onClose?.()
    }
  }

  return (
    <Modal
      modal-header={<h3>Registro</h3>}
      modal-body={
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmar Contraseña</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <Button 
            title="Registrarse" 
            variant="success" 
            type="submit"
          />
        </form>
      }
      onClose={onClose}
    />
  )
}

export default Register