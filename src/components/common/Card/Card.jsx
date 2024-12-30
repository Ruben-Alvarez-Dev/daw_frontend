import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Card.css';
import { useApp } from '../../../context/AppContext';

const Card = ({ id, header, body, footer }) => {
    const { cardActive, activateCard, clearCardActive, showCard, hideCard } = useApp();

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

    // Solo registramos la card una vez al montarse y la limpiamos al desmontarse
    useEffect(() => {
        if (title) {
            showCard(title);
        }
        return () => {
            if (title) {
                hideCard(title);
            }
        };
    // Eliminamos las dependencias para que solo se ejecute al montar/desmontar
    }, []); 

    const handleClick = () => {
        if (!isActive) {
            activateCard(title);
        }
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
