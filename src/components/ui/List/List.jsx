import PropTypes from 'prop-types'
import './List.css'

const List = ({ 
  items, 
  renderItem, 
  className = '', 
  twoLines = false, 
  responsive = true, 
  threeLines = false,
  itemType,
  activeItem = null,
  onItemClick = null
}) => {
  const getItemClassName = (item) => {
    let className = `list-item ${threeLines ? 'three-lines' : ''}`
    if (activeItem && item.id === activeItem.id) className += ' active'
    return className
  }

  const handleItemClick = (item) => {
    if (onItemClick) onItemClick(item)
  }

  return (
    <ul className={`list ${twoLines ? 'two-lines' : ''} ${responsive ? 'responsive' : ''} ${className}`}>
      {items.map((item, index) => (
        <li 
          key={item.id || index}
          className={getItemClassName(item)}
          onClick={() => handleItemClick(item)}
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  className: PropTypes.string,
  twoLines: PropTypes.bool,
  responsive: PropTypes.bool,
  threeLines: PropTypes.bool,
  itemType: PropTypes.oneOf(['user', 'restaurant', 'table', 'reservation']),
  activeItem: PropTypes.object,
  onItemClick: PropTypes.func
}

export default List
