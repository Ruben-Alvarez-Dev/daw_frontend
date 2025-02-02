import PropTypes from 'prop-types';
import ListItem from './ListItem';
import './ListItemContainer.css';

export default function ListItemContainer({ 
    items,
    renderContent,
    renderIds,
    onEdit,
    onDelete
}) {
    return (
        <div className="list-item-container">
            {items.map((item, index) => (
                <ListItem
                    key={item.id || index}
                    content={renderContent(item)}
                    ids={renderIds(item)}
                    onEdit={() => onEdit && onEdit(item)}
                    onDelete={() => onDelete && onDelete(item)}
                />
            ))}
        </div>
    );
}

ListItemContainer.propTypes = {
    items: PropTypes.array.isRequired,
    renderContent: PropTypes.func.isRequired,
    renderIds: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};
