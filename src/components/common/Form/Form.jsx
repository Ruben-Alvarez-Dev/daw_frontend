import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './Form.css';

export default function Form({
    id,
    fields,
    onSubmit,
    error,
    submitButton = { label: 'Submit', variant: 'primary' },
    cancelButton,
    hideActions
}) {
    // Inicializar formData con los valores de los campos
    const initialFormData = fields.reduce((acc, field) => {
        if ('value' in field) {
            acc[field.name] = field.value;
        }
        return acc;
    }, {});

    const [formData, setFormData] = useState({});

    // Limpiar campos al montar el componente
    useEffect(() => {
        setFormData({});
    }, []);

    // Actualizar formData cuando cambien los valores de los campos
    useEffect(() => {
        if (Object.keys(initialFormData).length > 0) {
            setFormData(initialFormData);
        }
    }, [fields]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData({}); // Limpiar después del submit
    };

    return (
        <form 
            id={id} 
            className="form"
            autoComplete="off" 
            spellCheck="false"
            onSubmit={handleSubmit}
        >
            {error && <div className="form__error">{error}</div>}
            
            <div className="form-input-group">
                {fields.map(field => (
                    <div key={field.name} className="form__field">
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                className="form__input"
                                value={formData[field.name] || field.defaultValue || ''}
                                onChange={handleChange}
                                required={field.required}
                                disabled={field.disabled}
                                autoComplete="off"
                            >
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                {...field}
                                value={formData[field.name] || ''}
                                className="form__input"
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        )}
                    </div>
                ))}
            </div>

            {!hideActions && (
                <div className="form__actions">
                    <Button
                        type="submit"
                        variant={submitButton.variant}
                    >
                        {submitButton.label}
                    </Button>

                    {cancelButton && (
                        <Button
                            type="button"
                            variant={cancelButton.variant}
                            onClick={cancelButton.onClick}
                        >
                            {cancelButton.label}
                        </Button>
                    )}
                </div>
            )}
        </form>
    );
}
