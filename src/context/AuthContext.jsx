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

const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1] || token;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedUser = decodeJwt(token); 
            if (decodedUser && decodedUser.name && decodedUser.email) {
                setUser(decodedUser);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (formData) => {
        try {
            setError(null); 
            const data = await authLogin(formData.email, formData.password);
            localStorage.setItem('authToken', data.token); 
            setIsAuthenticated(true);
            setUser(data.user); 
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
            localStorage.setItem('authToken', data.token); 
            setIsAuthenticated(true);
            setUser(data.user);
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
