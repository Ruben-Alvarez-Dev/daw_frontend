import PropTypes from 'prop-types';
import './Card.css';

export default function Card({ header, children, footer, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {header && <div className="card__header">{header}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

Card.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string
};
