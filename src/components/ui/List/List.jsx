import PropTypes from 'prop-types'
import './List.css'

const List = ({ items, renderItem, className = '', twoLines = false, responsive = true, threeLines = false }) => {
  return (
    <ul className={`list ${twoLines ? 'two-lines' : ''} ${responsive ? 'responsive' : ''} ${className}`}>
      {items.map((item, index) => (
        <li 
          key={item.id || index} 
          className={`list-item ${threeLines ? 'three-lines' : ''}`}
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
  threeLines: PropTypes.bool
}

export default List
