'use client'

import { useAuth } from '@/context/AuthContext';
import { getActualUser, updateUser, updatePassword } from '@/services/UserServices';
import { UserProfile, UserResponse } from '@/types/schemas';
import { useState, useCallback } from 'react';

const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const useUserServices = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async (): Promise<UserResponse | null> => {
        if (!isAuthenticated || authLoading) {
            return null;
        }

        try {
            const token = getToken();
            if (!token) {
                setError('No authentication token found');
                return null;
            }

            setIsLoading(true);

            const userData = await getActualUser(token);

            setIsLoading(false);

            if (userData.error) {
                setError(userData.error);
                return null;
            }

            return userData as UserResponse;
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to fetch user profile');
            setIsLoading(false);
            return null;
        }
    }, [isAuthenticated, authLoading]);

    const updateUserProfile = useCallback(async (userData: UserProfile): Promise<boolean> => {
        if (!isAuthenticated || authLoading) {
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = getToken();
            if (!token) {
                setError('No authentication token found');
                setIsLoading(false);
                return false;
            }

            const result = await updateUser(userData, token);
            setIsLoading(false);

            if (!result.success) {
                setError(result.message);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error updating user profile:', err);
            setError('Failed to update user profile');
            setIsLoading(false);
            return false;
        }
    }, [isAuthenticated, authLoading]);

    const changePassword = useCallback(async (
        currentPassword: string,
        newPassword: string
    ): Promise<boolean> => {
        if (!isAuthenticated || authLoading) {
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = getToken();
            if (!token) {
                setError('No authentication token found');
                setIsLoading(false);
                return false;
            }

            const result = await updatePassword(currentPassword, newPassword, token);
            setIsLoading(false);

            if (!result.success) {
                setError(result.message);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error changing password:', err);
            setError('Failed to change password');
            setIsLoading(false);
            return false;
        }
    }, [isAuthenticated, authLoading]);

    return {
        fetchUserProfile,
        updateUserProfile,
        changePassword,
        isLoading,
        error,
        clearError: useCallback(() => setError(null), []),
        currentUser: user,
    };
}; 