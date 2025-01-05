import React from 'react';
import './List.css';

function UserList({ users, selectedUser, onSelectUser, onCreateNew }) {
  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Users</h2>
        <button onClick={onCreateNew} className="btn-add">
          Add New User
        </button>
      </div>
      <div className="list-content">
        {users.map(user => (
          <div
            key={user.id}
            className={`list-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
            onClick={() => onSelectUser(user)}
          >
            <div className="item-info">
              <span className="item-name">{user.name}</span>
              <span className="item-detail">
                {user.email} | {user.role} | {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserList
