import PropTypes from 'prop-types';
import ListItemContainer from './ListItemContainer';
import ListItemSearchbar from './ListItemSearchbar';
import './List.css';

export default function List({ 
    items = [],
    searchPlaceholder,
    onSearch,
    loading = false,
    error = '',
    emptyMessage = 'No hay elementos para mostrar',
    renderContent,
    renderIds,
    onEdit,
    onDelete
}) {
    if (loading) {
        return <div className="list-message list-loading">Cargando...</div>;
    }

    if (error) {
        return <div className="list-message list-error">{error}</div>;
    }

    if (!items || items.length === 0) {
        return <div className="list-message list-empty">{emptyMessage}</div>;
    }

    return (
        <div className="list">
            {onSearch && (
                <ListItemSearchbar 
                    placeholder={searchPlaceholder}
                    onSearch={onSearch}
                />
            )}
            <ListItemContainer
                items={items}
                renderContent={renderContent}
                renderIds={renderIds}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
}

List.propTypes = {
    items: PropTypes.array,
    searchPlaceholder: PropTypes.string,
    onSearch: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    emptyMessage: PropTypes.string,
    renderContent: PropTypes.func.isRequired,
    renderIds: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};
