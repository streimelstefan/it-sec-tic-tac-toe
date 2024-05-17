import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username, password) => {    
    return true;
    /*
    try {
      // API-Call, um den Login zu prüfen
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        return true;
      } else {
        alert('Login fehlgeschlagen! Bitte überprüfen Sie Ihre Anmeldedaten.');
        return false;
        }
    } catch (error) {
      alert('Ein Fehler ist aufgetreten beim Versuch, sich anzumelden.');
      console.error('Login error:', error);
      return false;
    }
    */
  };

  const logout = () => {
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
