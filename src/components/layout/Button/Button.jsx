import React from 'react';
import './Button.css';

const Button = ({
    children,
    label,
    variant = 'primary',
    size = 'medium',
    onClick,
    onDoubleClick,
    disabled = false,
    type = 'button',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    loading = false,
    className = ''
}) => {
    const buttonClasses = [
        'layout-button',
        `layout-button--${variant}`,
        `layout-button--${size}`,
        fullWidth ? 'layout-button--full-width' : '',
        loading ? 'layout-button--loading' : '',
        disabled ? 'layout-button--disabled' : '',
        className
    ].filter(Boolean).join(' ');

    const handleClick = (e) => {
        if (loading || disabled) return;
        onClick?.(e);
    };

    const handleDoubleClick = (e) => {
        if (loading || disabled) return;
        onDoubleClick?.(e);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="layout-button__content">
                    <span className="layout-button__spinner"></span>
                    <span className="layout-button__text">
                        {label || children}
                    </span>
                </div>
            );
        }

        if (!icon) {
            return label || children;
        }

        return (
            <div className="layout-button__content">
                {iconPosition === 'left' && (
                    <span className="layout-button__icon">{icon}</span>
                )}
                <span className="layout-button__text">
                    {label || children}
                </span>
                {iconPosition === 'right' && (
                    <span className="layout-button__icon">{icon}</span>
                )}
            </div>
        );
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className={buttonClasses}
            disabled={disabled || loading}
        >
            {renderContent()}
        </button>
    );
};

export default Button;
