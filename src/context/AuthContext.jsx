import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (userData) => {
    const response = await fetch('http://0.0.0.0:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        password_confirmation: userData.password_confirmation
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }

    setUser(data.user);
    setToken(data.authorisation.token);
    return data;
  };

  const login = async (token, userData) => {
    setUser(userData);
    setToken(token);
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
    return { user: userData, token };
  };

  const logout = async () => {
    if (!token) return;

    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } finally {
      setUser(null);
      setToken(null);
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
