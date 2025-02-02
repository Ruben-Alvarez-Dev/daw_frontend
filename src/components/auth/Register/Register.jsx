import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../common/Modal/Modal';
import Form from '../../common/Form/Form';
import './Register.css';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');

    const fields = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre completo',
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
            name: 'password_confirmation',
            type: 'password',
            placeholder: 'Confirmar contraseña',
            required: true
        }
    ];

    const handleRegister = async (formData) => {
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al registrar usuario');
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={() => navigate('/')}
            title="Registrarse"
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
                onSubmit={handleRegister}
                submitButton={{
                    label: 'Registrarse',
                    variant: 'primary'
                }}
            />
        </Modal>
    );
}
