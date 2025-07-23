import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as authLogin, signup as authSignup } from '../services/authServices';

const ERROR_CONTEXT_MISUSE = 'useAuth must be used within AuthProvider';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(ERROR_CONTEXT_MISUSE);
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Used to check for a token on initial load
    const [error, setError] = useState(null);

    // Check for an authentication token on initial load
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    // --- Authentication Logic ---

    const handleLogin = async (formData) => {
        try {
            setError(null); 
            const data = await authLogin(formData.email, formData.password);
            setIsAuthenticated(true);
            // setUser(data.user); 
            return data; 
        } catch (error) {
            setError(error.message ||  "Login failed");
            throw error;
        }
    };

    const handleSignup = async (userData) => {
        try {
            setError(null);
            const data = await authSignup(userData);
            return data;
        } catch (error) {
            setError(error.message ||  "Login failed");
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {/* We don't render children until the initial token check is complete */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

