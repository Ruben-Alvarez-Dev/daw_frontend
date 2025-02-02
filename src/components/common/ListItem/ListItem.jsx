import PropTypes from 'prop-types';
import './ListItem.css';

export default function ListItem({ children, className, actions }) {
    return (
        <li className={`list-item ${className || ''}`}>
            <div className="list-item-content">
                {children}
            </div>
            {actions && (
                <div className="list-item-actions">
                    {actions}
                </div>
            )}
        </li>
    );
}

ListItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    actions: PropTypes.node
};
