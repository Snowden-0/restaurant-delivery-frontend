import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/user/LoginPage';
import SignupPage from './views/user/SignupPage';
import HomePage from './views/HomePage';
import * as authService from './services/authServices';
import ErrorPopup from './components/ui/ErrorPopup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuth = async (formData, type) => {
    try {
      if (type === 'login') {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.signup(formData);
      }
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err.message || `${type} failed`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <HomePage onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <LoginPage onLogin={(data) => handleAuth(data, 'login')} /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/signup" 
            element={
              !isAuthenticated ? 
                <SignupPage onSignup={(data) => handleAuth(data, 'signup')} /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;