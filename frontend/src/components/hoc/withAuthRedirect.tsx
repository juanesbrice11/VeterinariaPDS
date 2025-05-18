'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function withAuthRedirect<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithAuthRedirectWrapper(props: P) {
        const { isAuthenticated, loading } = useAuth();
        const router = useRouter();
        const [isInitializing, setIsInitializing] = useState(true);

        useEffect(() => {
            if (!loading) {
                if (isAuthenticated) {
                    router.replace('/profile');
                } else {
                    setIsInitializing(false);
                }
            }
        }, [isAuthenticated, loading, router]);

        if (loading || isInitializing) {
            return (
                <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            );
        }

        return !isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
} 