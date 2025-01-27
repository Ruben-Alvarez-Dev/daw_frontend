import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <Button 
                            variant="secondary" 
                            size="small" 
                            onClick={onClose}
                            label="×"
                        />
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
