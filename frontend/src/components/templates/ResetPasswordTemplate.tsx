'use client'
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GenericForm, { FormField } from '@/components/organisms/GenericForm';
import { resetPassword } from '@/services/AuthServices';
import { toast } from 'react-hot-toast';

export default function ResetPasswordTemplate() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (value: string) => {
        if (value.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(value)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(value)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*]/.test(value)) {
            return 'Password must contain at least one special character (!@#$%^&*)';
        }
        return null;
    };

    const fields: FormField[] = [
        {
            name: 'newPassword',
            label: 'New Password',
            type: showPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Enter your new password',
            validation: validatePassword,
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowPassword(!showPassword)
        },
        {
            name: 'confirmPassword',
            label: 'Confirm Password',
            type: showConfirmPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Confirm your new password',
            validation: (value: string, formData?: Record<string, any>) => {
                if (!formData?.newPassword) return 'Please enter a new password first';
                if (value !== formData.newPassword) {
                    return 'Passwords do not match';
                }
                return null;
            },
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowConfirmPassword(!showConfirmPassword)
        }
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        if (!token) {
            toast.error("Invalid or missing token.");
            return;
        }

        const response = await resetPassword(token, formData.newPassword);
        
        if (response.success) {
            toast.success("Password successfully updated");
            setTimeout(() => router.push('/login'), 3000);
        } else {
            toast.error(response.error || "Error changing password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/assets/Background.png')] bg-cover bg-center bg-no-repeat">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
                
                <GenericForm
                    fields={fields}
                    onSubmit={handleSubmit}
                    submitButtonText="Change Password"
                />

                <div className="mt-4 text-sm text-gray-600">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Minimum 8 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character (!@#$%^&*)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 