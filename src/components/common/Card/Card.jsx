import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Card.css';
import { useApp } from '../../../context/AppContext';

const Card = ({ id, header, body, footer }) => {
    const { cardActive, activateCard, showCard, hideCard } = useApp();

    // Extraer el título del header, buscando recursivamente si es necesario
    const getTitle = (element) => {
        if (!element) return null;
        if (typeof element === 'string') return element;
        if (element.type === 'h2') {
            return typeof element.props.children === 'string' 
                ? element.props.children 
                : getTitle(element.props.children);
        }
        return null;
    };

    const title = getTitle(header);

    useEffect(() => {
        if (title) {
            showCard(title);
        }
        return () => {
            if (title) {
                hideCard(title);
            }
        };
    }, []); 

    const handleClick = () => {
        activateCard(title);
    };

    const isActive = cardActive === title;

    return (
        <div 
            id={id}
            className={`card ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div className="card-header">
                {header}
            </div>
            <div className="card-body">
                {body}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

Card.propTypes = {
    id: PropTypes.string.isRequired,
    header: PropTypes.node,
    body: PropTypes.node,
    footer: PropTypes.node
};

export default Card;
