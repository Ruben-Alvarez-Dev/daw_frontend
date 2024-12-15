// Label.jsx
import './Label.css'
import PropTypes from 'prop-types'

const Label = ({ text, variant = "default", icon }) => {
  return (
    <span className={`label ${variant}`}>
      {icon && <span className="label-icon">{icon}</span>}
      {text}
    </span>
  )
}

Label.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['label-default', 'label-info', 'label-success', 'label-warning', 'label-error']),
  icon: PropTypes.element
}

export default Label