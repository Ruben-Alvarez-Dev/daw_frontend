import './Card.css'
import PropTypes from 'prop-types'

const Card = ({ 'card-header': cardHeader, 'card-body': cardBody, 'card-footer': cardFooter, className }) => {
  return (
    <div className={`card ${className || ''}`}>
      <div className="card-header">
        {cardHeader}
      </div>
      <div className="card-body">
        {cardBody}
      </div>
      <div className="card-footer">
        {cardFooter}
      </div>
    </div>
  )
}

Card.propTypes = {
  'card-header': PropTypes.node.isRequired,
  'card-body': PropTypes.node.isRequired,
  'card-footer': PropTypes.node,
  className: PropTypes.string
}

export default Card