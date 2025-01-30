import React from 'react';
import Button from '../Button/Button';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <Button variant="secondary" size="small" onClick={onClose} label="×" />
                    </div>
                )}
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}

export default Modal;
