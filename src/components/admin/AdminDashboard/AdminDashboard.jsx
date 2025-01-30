import Button from '../../common/Button/Button';
import Card from '../../common/Card/Card';
import './AdminDashboard.css';

export default function AdminDashboard({ onActionClick }) {
  return (
    <>
      <div className="admin-dashboard">

        <Card header={<h3>Izquierda</h3>}>
          <h3>hola izquierda</h3>
        </Card>

        <Card header={<h3>Derecha</h3>}>
          <h3>hola derecha</h3>
        </Card>

      </div>
    </>
  );
}
