import './Button.css'
import PropTypes from 'prop-types'

const Button = ({ title, variant = 'primary', onClick, disabled = false }) => {
  return (
    <button 
      className={`button ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  )
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'delete']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool
}

export default Button