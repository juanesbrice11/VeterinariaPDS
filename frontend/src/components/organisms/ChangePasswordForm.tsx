'use client'

import React, { useState } from 'react'
import { updatePassword } from '@/services/UserServices'
import GenericForm, { FormField } from './GenericForm'
import { toast } from 'react-hot-toast'

const ChangePasswordForm: React.FC = () => {
    const [formError, setFormError] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
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
            name: 'currentPassword',
            label: 'Current Password',
            type: showCurrentPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Enter your current password',
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowCurrentPassword(!showCurrentPassword)
        },
        {
            name: 'newPassword',
            label: 'New Password',
            type: showNewPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Enter your new password',
            validation: validatePassword,
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowNewPassword(!showNewPassword)
        },
        {
            name: 'confirmPassword',
            label: 'Confirm New Password',
            type: showConfirmPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Confirm your new password',
            validation: (value: string, formData?: Record<string, any>) => {
                if (!formData?.newPassword) return 'New password is required';
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
        setFormError(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setFormError('Authentication error: Your session has expired');
            return;
        }

        try {
            const response = await updatePassword(formData.currentPassword, formData.newPassword, token);
            
            if (!response.success) {
                setFormError(response.message);
                return;
            }

            toast.success(response.message);
            window.location.reload();
        } catch (error) {
            setFormError('Error updating password');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
            
            <div className="mb-4 text-sm text-gray-600">
                <p>The password must meet the following requirements:</p>
                <ul className="list-disc list-inside mt-2">
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character (!@#$%^&*)</li>
                </ul>
            </div>

            <GenericForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText="Update Password"
            />

            {formError && (
                <div className="mt-4 text-red-500 text-sm p-2 bg-red-50 rounded-md">
                    {formError}
                </div>
            )}
        </div>
    );
};

export default ChangePasswordForm;