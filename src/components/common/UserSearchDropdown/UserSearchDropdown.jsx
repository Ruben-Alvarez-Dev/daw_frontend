import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './UserSearchDropdown.css';

export default function UserSearchDropdown({ users, value, onChange, placeholder, disabled, reset }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedUser = users.find(user => user.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectedUser && !searchTerm) {
            setSearchTerm(selectedUser.name);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (!value || reset) {
            setSearchTerm('');
            if (reset) {
                onChange('');
            }
        }
    }, [value, reset, onChange]);

    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        
        const search = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            (user.phone && user.phone.includes(search))
        );
    });

    const handleSelect = (user) => {
        onChange(user.id);
        setSearchTerm(user.name);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);
        if (!value) {
            onChange('');
        }
    };

    return (
        <div className="user-search-dropdown" ref={dropdownRef}>
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => !disabled && setIsOpen(true)}
                disabled={disabled}
            />
            {isOpen && (
                <div className="dropdown-list">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className="dropdown-item"
                                onClick={() => handleSelect(user)}
                            >
                                <div className="user-info-primary">{user.name}</div>
                                <div className="user-info-secondary">
                                    <span>{user.email}</span>
                                    {user.phone && <span>{user.phone}</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-no-results">No se encontraron usuarios</div>
                    )}
                </div>
            )}
        </div>
    );
}

UserSearchDropdown.propTypes = {
    users: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    reset: PropTypes.bool
};
