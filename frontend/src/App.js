import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage"; // Stellen Sie sicher, dass der Pfad zu Ihrer LoginPage-Datei korrekt ist
import RegisterPage from "./RegisterPage"; // Stellen Sie sicher, dass der Pfad zu Ihrer LoginPage-Datei korrekt ist
import MainPage from "./MainPage"; // Stellen Sie sicher, dass der Pfad zu Ihrer MainPage-Datei korrekt ist
import { useAuth } from "./AuthContext"; // Stellen Sie sicher, dass der Pfad zu Ihrer AuthContext-Datei korrekt ist

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/main"
          element={
            isAuthenticated ? <MainPage /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
