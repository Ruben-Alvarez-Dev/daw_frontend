import { useRef } from 'react';
import CustomerReservationForm from './CustomerReservationForm';
import CustomerReservationList from './CustomerReservationList';

export default function CustomerDashboard() {
  const reservationListRef = useRef();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Cliente</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sección de Reservas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
          
          {/* Formulario de Reservas */}
          <div className="mb-8">
            <CustomerReservationForm 
              listRef={reservationListRef}
            />
          </div>

          {/* Lista de Reservas */}
          <div>
            <CustomerReservationList 
              ref={reservationListRef}
            />
          </div>
        </div>

        {/* Sección de Información del Cliente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Mi Perfil</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Aquí podrás ver y gestionar:</p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>Tus reservas activas</li>
                <li>Historial de reservas</li>
                <li>Estado de tus reservas</li>
                <li>Preferencias de reserva</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Información Importante</h3>
              <p className="text-blue-700">
                Recuerda que puedes cancelar tus reservas con hasta 24 horas de antelación.
                Para cualquier modificación posterior, por favor contacta directamente con el restaurante.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
