import { useState } from 'react'
import './Login.css'
import Card from '../../ui/Card/Card'
import Button from '../../ui/Button/Button'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí irá la lógica de login cuando implementemos el backend
    console.log('Login attempt:', formData)
  }

  return (
    <Card
      card-header={<h3>Iniciar Sesión</h3>}
      card-body={
        <form onSubmit={handleSubmit} className="login-form">
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
      card-footer={
        <>
          <Button 
            title="Iniciar Sesión" 
            variant="primary"
            onClick={handleSubmit}
          />
          <Button 
            title="¿No tienes cuenta?" 
            variant="secondary"
            // Aquí irá la navegación al registro
          />
        </>
      }
    />
  )
}

export default Login