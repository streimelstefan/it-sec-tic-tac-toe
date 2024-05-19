import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"; // Importieren Sie ChakraProvider
import { AuthProvider } from "./AuthContext";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage"; // Stellen Sie sicher, dass der Pfad zu Ihrer LoginPage-Datei korrekt ist
import MainPage from "./MainPage";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      {" "}
      {/* Hüllen Sie Ihre gesamte Anwendung in ChakraProvider ein */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
