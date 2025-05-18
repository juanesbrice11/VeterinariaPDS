'use client'
import React, { useState } from 'react';
import { registerUser } from "@/services/AuthServices";
import { useRouter } from 'next/navigation';
import { RegisterUserData } from '@/types/schemas';
import GenericForm, { FormField } from '@/components/organisms/GenericForm';
import { withAuthRedirect } from '@/components/hoc/withAuthRedirect';

function RegisterComponent() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const today = new Date().toISOString().split("T")[0];
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    const minDateStr = minDate.toISOString().split("T")[0];

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
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name',
            fullWidth: true
        },
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
            validation: validatePassword,
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowPassword(!showPassword)
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'text',
            required: true,
            placeholder: 'Enter your phone number',
            fullWidth: true
        },
        {
            name: 'birthDate',
            label: 'Birth Date',
            type: 'date',
            required: true,
            max: today,
            validation: (value) => {
                const date = new Date(value);
                if (date > new Date(today)) {
                    return 'Date cannot be in the future';
                }
                if (date < new Date(minDateStr)) {
                    return 'Date cannot be more than 100 years ago';
                }
                return null;
            },
            fullWidth: true
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
                { value: 'M', label: 'Male' },
                { value: 'F', label: 'Female' },
                { value: 'O', label: 'Other' }
            ],
            fullWidth: true
        },
        {
            name: 'documentType',
            label: 'ID Type',
            type: 'select',
            required: true,
            options: [
                { value: 'CC', label: 'CC' },
                { value: 'TI', label: 'TI' },
                { value: 'CE', label: 'CE' }
            ],
            fullWidth: true
        },
        {
            name: 'documentNumber',
            label: 'ID Number',
            type: 'text',
            required: true,
            placeholder: 'Enter your ID number',
            fullWidth: true
        },
        {
            name: 'address',
            label: 'Address',
            type: 'text',
            required: true,
            placeholder: 'Enter your address',
            fullWidth: true
        },
        {
            name: 'bio',
            label: 'Bio',
            type: 'text',
            required: true,
            placeholder: 'Tell us about yourself',
            fullWidth: true
        }
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            const completeFormData: RegisterUserData = {
                ...formData,
                birthDate: formData.birthDate || new Date().toISOString().split('T')[0],
                name: formData.name || '',
                email: formData.email || '',
                password: formData.password || '',
                documentType: formData.documentType || 'CC',
                documentNumber: formData.documentNumber || '',
                phone: formData.phone || '',
                gender: formData.gender || '',
                address: formData.address || '',
                bio: formData.bio || '',
            };

            const data = await registerUser(completeFormData);
            if (data.message) {
                setMessage(data.message);
                router.push("/login");
                setError("");
            } else {
                setError(data.error || "Error registering user");
            }
        } catch {
            setError("Server error");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl text-black">
                <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
                
                <GenericForm
                    fields={fields}
                    onSubmit={handleSubmit}
                    submitButtonText="Register"
                />

                {error && <p className="mt-4 text-red-500">{error}</p>}
                {message && <p className="mt-4 text-green-500">{message}</p>}

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

export default withAuthRedirect(RegisterComponent);
