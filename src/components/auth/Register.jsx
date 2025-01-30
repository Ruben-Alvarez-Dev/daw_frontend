import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal/Modal';
import Form from '../common/Form/Form';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');

    const fields = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre',
            required: true
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            required: true
        },
        {
            name: 'phone',
            type: 'tel',
            placeholder: 'Teléfono',
            required: true
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña',
            required: true
        },
        {
            name: 'confirmPassword',
            type: 'password',
            placeholder: 'Confirmar contraseña',
            required: true
        }
    ];

    const handleSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const { user } = await register(data);
            
            if (!user) {
                setError('Error al obtener la información del usuario');
                return;
            }

            // Redirigir basado en el rol, igual que en Login
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
            setError(err.message);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={() => navigate('/')}
            title="Registro"
            footer={
                <div className="modal-footer-links">
                    <span>¿Ya tienes cuenta?</span>
                    <Link to="/login">Inicia sesión</Link>
                </div>
            }
        >
            <Form
                fields={fields}
                error={error}
                onSubmit={handleSubmit}
                submitButton={{
                    label: 'Registrar usuario',
                    variant: 'primary'
                }}
            />
        </Modal>
    );
}
