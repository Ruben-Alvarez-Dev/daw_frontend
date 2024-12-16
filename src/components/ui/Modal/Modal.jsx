import PropTypes from 'prop-types'
import './Modal.css'

const Modal = ({ 
  'modal-header': modalHeader, 
  'modal-body': modalBody, 
  'modal-footer': modalFooter,
  onClose,
  className 
}) => {
  return (
    <div className="modal-overlay">
      <div className={`modal ${className || ''}`}>
        {modalHeader && (
          <div className="modal-header">
            {modalHeader}
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
        )}
        {modalBody && <div className="modal-body">{modalBody}</div>}
        {modalFooter && <div className="modal-footer">{modalFooter}</div>}
      </div>
    </div>
  )
}

Modal.propTypes = {
  'modal-header': PropTypes.node,
  'modal-body': PropTypes.node,
  'modal-footer': PropTypes.node,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default Modal