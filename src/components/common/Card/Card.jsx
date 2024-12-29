import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ id, header, body, footer, isActive, onActivate }) => {
    const handleCardClick = (e) => {
        if (!isActive) {
            e.preventDefault();
            e.stopPropagation();
            onActivate(id);
            return;
        }
    };

    return (
        <div 
            className={`card ${isActive ? 'active' : ''}`}
            onClick={handleCardClick}
        >
            {header && <div className="card-header">{header}</div>}
            <div className="card-body">{body}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

Card.propTypes = {
    id: PropTypes.string.isRequired,
    header: PropTypes.node,
    body: PropTypes.node.isRequired,
    footer: PropTypes.node,
    isActive: PropTypes.bool,
    onActivate: PropTypes.func.isRequired
};

export default Card;
