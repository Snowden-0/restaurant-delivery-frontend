import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
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
    const logoutTimerRef = useRef();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        clearTimeout(logoutTimerRef.current);
    }, []);

    const checkTokenExpiration = useCallback((token) => {
        const decoded = decodeJwt(token);
        if (decoded && decoded.exp) {
            const expirationTime = decoded.exp * 1000;
            const currentTime = Date.now();
            
            if (expirationTime < currentTime) {
                handleLogout();
                return false;
            } else {
                logoutTimerRef.current = setTimeout(
                    handleLogout, 
                    expirationTime - currentTime
                );
                return true;
            }
        }
        return false;
    }, [handleLogout]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedUser = decodeJwt(token); 
            if (decodedUser && decodedUser.name && decodedUser.email) {
                const isValid = checkTokenExpiration(token);
                if (isValid) {
                    setUser(decodedUser);
                    setIsAuthenticated(true);
                }
            } else {
                localStorage.removeItem('authToken');
            }
        }
        setIsLoading(false);
        
        return () => clearTimeout(logoutTimerRef.current);
    }, [checkTokenExpiration]);

    const handleLogin = async (formData) => {
        try {
            setError(null); 
            const data = await authLogin(formData.email, formData.password);
            localStorage.setItem('authToken', data.token); 
            const decodedUser = decodeJwt(data.token);
            
            const isValid = checkTokenExpiration(data.token);
            if (isValid) {
                setUser(decodedUser); 
                setIsAuthenticated(true);
            }
            
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
            const decodedUser = decodeJwt(data.token);
            
            const isValid = checkTokenExpiration(data.token);
            if (isValid) {
                setUser(decodedUser);
                setIsAuthenticated(true);
            }
            
            return data;
        } catch (error) {
            setError(error.message ||  "Signup failed");
            throw error;
        }
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
            {!isLoading && children}
        </AuthContext.Provider>
    );
};