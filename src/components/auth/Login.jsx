import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal/Modal';
import Form from '../common/Form/Form';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const fields = [
        {
            name: 'identifier',
            type: 'text',
            placeholder: 'Email o Teléfono',
            required: true
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña',
            required: true
        }
    ];

    const handleSubmit = async (data) => {
        try {
            // Si el identifier contiene @, es un email
            const { user } = await login(data.identifier, data.password);
            
            if (!user) {
                setError('Error al obtener la información del usuario');
                return;
            }

            // Redirigir basado en el rol
            switch (user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'customer':
                    navigate('/customer');
                    break;
                default:
                    setError('Rol de usuario no reconocido');
            }
        } catch (err) {
            console.error('Error en login:', err);
            setError(err.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={() => navigate('/')}
            title="Iniciar Sesión"
            footer={
                <div className="modal-footer-links">
                    <span>¿No tienes cuenta?</span>
                    <Link to="/register">Regístrate</Link>
                </div>
            }
        >
            <Form
                fields={fields}
                error={error}
                onSubmit={handleSubmit}
                submitButton={{
                    label: 'Iniciar sesión',
                    variant: 'primary'
                }}
            />
        </Modal>
    );
}