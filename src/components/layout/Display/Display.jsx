import './Display.css'
import Card from '../../ui/Card/Card'
import Button from '../../ui/Button/Button'

const Display = () => {
  return (
    <div className="display">
      <Card 
        card-header={<h3>Resumen de Pedidos</h3>}
        card-body={
          <>
            <h4>Pedidos Pendientes</h4>
            <ul>
              <li>Mesa 3: Paella Mixta (2) - En preparación</li>
              <li>Mesa 7: Sushi Variado (1) - Pendiente</li>
              <li>Mesa 12: Pasta Carbonara (3) - En preparación</li>
            </ul>
            <p>Tiempo medio de espera: 15 minutos</p>
          </>
        }
        card-footer={
          <>
            <span>Actualizado hace 5 min</span>
            <Button title="Actualizar" variant="secondary" />
          </>
        }
      />

      <Card 
        card-header={<h3>Estado de Mesas</h3>}
        card-body={
          <>
            <div className="stats">
              <p>Mesas Ocupadas: 8/15</p>
              <p>Reservas Pendientes: 3</p>
              <p>Tiempo medio de ocupación: 45 min</p>
            </div>
            <div className="alerts">
              <p>⚠️ Mesa 5: Más de 1 hora sin pedir</p>
              <p>🔔 Mesa 9: Solicita la cuenta</p>
            </div>
          </>
        }
        card-footer={
          <>
            <Button title="Ver Detalles" variant="secondary" />
            <Button title="Gestionar Reservas" variant="primary" />
          </>
        }
      />
            <Card 
        card-header={<h3>Resumen de Pedidos</h3>}
        card-body={
          <>
            <h4>Pedidos Pendientes</h4>
            <ul>
              <li>Mesa 3: Paella Mixta (2) - En preparación</li>
              <li>Mesa 7: Sushi Variado (1) - Pendiente</li>
              <li>Mesa 12: Pasta Carbonara (3) - En preparación</li>
            </ul>
            <p>Tiempo medio de espera: 15 minutos</p>
          </>
        }
        card-footer={
          <>
            <span>Actualizado hace 5 min</span>
            <Button title="Actualizar" variant="secondary" />
          </>
        }
      />
    </div>
  )
}

export default Display