import PropTypes from 'prop-types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './ListItem.css';

export default function ListItem({
    content,
    ids,
    onEdit,
    onDelete
}) {
    return (
        <div className="list-item">
            <div className="list-item-content">
                {content}
            </div>
            <div className="list-item-ids">
                {ids}
                {(onEdit || onDelete) && (
                    <div className="list-item-actions">
                        {onEdit && (
                            <button 
                                onClick={onEdit}
                                className="icon-button"
                                title="Editar"
                            >
                                <FiEdit2 />
                            </button>
                        )}
                        {onDelete && (
                            <button 
                                onClick={onDelete}
                                className="icon-button delete"
                                title="Eliminar"
                            >
                                <FiTrash2 />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

ListItem.propTypes = {
    content: PropTypes.node.isRequired,
    ids: PropTypes.node.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};
