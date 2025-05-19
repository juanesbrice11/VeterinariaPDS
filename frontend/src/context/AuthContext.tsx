'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { validateToken } from '@/services/AuthServices';

interface User {
    id: number;
    role: string;
    [key: string]: any;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<boolean>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const getLocalStorage = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
};

const setLocalStorage = (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
};

const removeLocalStorage = (key: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const verifyToken = useCallback(async (token: string): Promise<boolean> => {
        try {
            const validation = await validateToken(token);

            if (validation.valid && validation.user) {
                setUser({ ...validation.user, token });
                setIsAuthenticated(true);
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                removeLocalStorage('token');
                return false;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setUser(null);
            setIsAuthenticated(false);
            removeLocalStorage('token');
            return false;
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            if (initialized) return;

            setLoading(true);
            const token = getLocalStorage('token');

            if (token) {
                await verifyToken(token);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }

            setLoading(false);
            setInitialized(true);
        };

        if (typeof window !== 'undefined') {
            initializeAuth();
        } else {
            setLoading(false);
            setInitialized(true);
        }
    }, [verifyToken, initialized]);

    const login = useCallback(async (token: string): Promise<boolean> => {
        setLoading(true);
        const isValid = await verifyToken(token);

        if (isValid) {
            setLocalStorage('token', token);
        }

        setLoading(false);
        return isValid;
    }, [verifyToken]);

    const logout = useCallback(() => {
        removeLocalStorage('token');
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const refreshAuth = useCallback(async () => {
        setLoading(true);
        const token = getLocalStorage('token');

        if (token) {
            await verifyToken(token);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }

        setLoading(false);
    }, [verifyToken]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            refreshAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 