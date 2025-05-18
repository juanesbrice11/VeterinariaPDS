'use client'
import React from 'react';
import { requestPasswordReset } from '@/services/AuthServices';
import GenericForm, { FormField } from './GenericForm';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
    const fields: FormField[] = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'Enter your email address',
            fullWidth: true
        }
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            const response = await requestPasswordReset(formData.email);
            toast.success(response.message || "Check your email for reset instructions");
        } catch (err: any) {
            toast.error(err.message || "Error requesting password reset");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/assets/Background.png')] bg-cover bg-center bg-no-repeat">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                
                <GenericForm
                    fields={fields}
                    onSubmit={handleSubmit}
                    submitButtonText="Send Reset Link"
                />
            </div>
        </div>
    );
}
