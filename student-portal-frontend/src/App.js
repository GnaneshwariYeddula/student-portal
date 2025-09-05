// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Marks from "./pages/Marks";
import Certificates from "./pages/Certificates";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token"); // ✅ always checks latest value

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard/profile" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard/profile" /> : <RegisterPage />}
        />

        {/* Dashboard wrapper routes */}
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        >
          <Route path="profile" element={<Profile />} />
          <Route path="marks" element={<Marks />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="*" element={<Navigate to="profile" />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard/profile" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}
