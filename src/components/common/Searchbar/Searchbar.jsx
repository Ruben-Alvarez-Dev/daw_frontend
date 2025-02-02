import './Searchbar.css';

export default function Searchbar({ value, onChange, placeholder }) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="searchbar-input"
        />
    );
}
