import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../common/Modal/Modal';
import Form from '../../common/Form/Form';
import './Login.css';

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

    const handleLogin = async (formData) => {
        try {
            await login(formData.identifier, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
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
                onSubmit={handleLogin}
                submitButton={{
                    label: 'Iniciar sesión',
                    variant: 'primary'
                }}
            />
        </Modal>
    );
}
