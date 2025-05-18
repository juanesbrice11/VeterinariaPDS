'use client'
import React, { useState } from 'react'
import { loginUser } from "@/services/AuthServices"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GenericForm, { FormField } from './GenericForm';
import { useAuth } from '@/context/AuthContext';
import { withAuthRedirect } from '@/components/hoc/withAuthRedirect';
import { toast } from 'react-hot-toast';

function LoginComponent() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const fields: FormField[] = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'Enter your email',
            fullWidth: true
        },
        {
            name: 'password',
            label: 'Password',
            type: showPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Enter your password',
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowPassword(!showPassword)
        }
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        setLoading(true);

        try {
            const data = await loginUser(formData.email, formData.password);
            if (data.token) {
                const loginSuccess = await login(data.token);
                if (loginSuccess) {
                    toast.success(data.message || "Login successful");
                    setTimeout(() => {
                        router.push('/profile');
                        router.refresh();
                    }, 3000);
                } else {
                    toast.error("Authentication failed");
                }
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[url('/assets/Background.png')] bg-cover bg-center bg-no-repeat">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                
                <GenericForm
                    fields={fields}
                    onSubmit={handleSubmit}
                    submitButtonText={loading ? "Logging in..." : "Login"}
                />

                <div className="mt-4 text-center">
                    <Link href="/password" className="text-blue-600 hover:underline text-sm">
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default withAuthRedirect(LoginComponent);
