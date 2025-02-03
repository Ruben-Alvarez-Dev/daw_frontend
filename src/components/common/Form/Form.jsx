import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './Form.css';

export default function Form({
    id,
    fields,
    onSubmit,
    error,
    submitButton = { label: 'Guardar cambios', variant: 'primary' },
    cancelButton,
    hideActions
}) {
    const initialFormData = fields.reduce((acc, field) => {
        acc[field.name] = field.value || '';
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        setFormData(initialFormData);
    }, [fields]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
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
                        {field.label && (
                            <label htmlFor={field.name} className="form__label">
                                {field.label}
                            </label>
                        )}
                        {field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                className="form__input"
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                                disabled={field.disabled}
                                autoComplete="off"
                            >
                                <option value="">Seleccionar...</option>
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name] || ''}
                                className="form__input"
                                onChange={handleChange}
                                required={field.required}
                                disabled={field.disabled}
                                placeholder={field.placeholder}
                                min={field.min}
                                max={field.max}
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
