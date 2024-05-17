import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({});

  const login = async (username, password) => {
    try {
      // API-Call, um den Login zu prüfen
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      if (response.status === 201) {
        setIsAuthenticated(true);
        setCredentials(response.data);
        return true;
      } else {
        alert("Login fehlgeschlagen! Bitte überprüfen Sie Ihre Anmeldedaten.");
        setCredentials({});
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      alert("Ein Fehler ist aufgetreten beim Versuch, sich anzumelden.");
      console.error("Login error:", error);
      setCredentials({});
      setIsAuthenticated(false);
      return false;
    }
  };

  const getAuthHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    };
  };

  const logout = () => {
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
};
