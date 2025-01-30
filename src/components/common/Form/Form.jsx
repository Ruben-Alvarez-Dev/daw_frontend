import { useState } from 'react';
import Button from '../Button/Button';
import './Form.css';

export default function Form({
    id,
    fields,
    onSubmit,
    error,
    submitButton = { label: 'Submit', variant: 'primary' },
    secondaryAction
}) {
    const [formData, setFormData] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'identifier') {
            // Detect if input is email or phone
            const isEmail = value.includes('@');
            setFormData({
                ...formData,
                identifierType: isEmail ? 'email' : 'phone',
                [name]: value
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                        <input
                            {...field}
                            className="form__input"
                            onChange={handleChange}
                            value={formData[field.name] || ''}
                            required={field.required}
                            autoComplete="new-password"
                        />
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <Button
                    type="submit"
                    variant={submitButton.variant}
                    label={submitButton.label}
                />
                
                {secondaryAction && (
                    <Button
                        type="button"
                        variant={secondaryAction.variant || 'secondary'}
                        label={secondaryAction.label}
                        onClick={secondaryAction.onClick}
                    />
                )}
            </div>
        </form>
    );
}
