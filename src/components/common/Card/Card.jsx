import PropTypes from 'prop-types';
import './Card.css';

export default function Card({ header, body, footer, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {header && <div className="card__header">{header}</div>}
      <div className="card__body">{body}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string
};
