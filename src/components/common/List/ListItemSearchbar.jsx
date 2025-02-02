import PropTypes from 'prop-types';
import './ListItemSearchbar.css';

export default function ListItemSearchbar({
    placeholder = 'Buscar...',
    onSearch
}) {
    return (
        <div className="list-item-searchbar">
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value)}
                className="list-item-searchbar-input"
            />
        </div>
    );
}

ListItemSearchbar.propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func.isRequired
};
