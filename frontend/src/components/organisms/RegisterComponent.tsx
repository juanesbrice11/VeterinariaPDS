    'use client'
import React, { useState } from 'react';
import { registerUser } from "@/services/AuthServices";
import { useRouter } from 'next/navigation';
import { RegisterUserData } from '@/types/schemas';
import GenericForm, { FormField } from '@/components/organisms/GenericForm';

export default function RegisterComponent() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const today = new Date().toISOString().split("T")[0];
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    const minDateStr = minDate.toISOString().split("T")[0];

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

    const fields: FormField[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: true,
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'text',
            required: true,
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
                    return 'La fecha no puede ser futura';
                }
                if (date < new Date(minDateStr)) {
                    return 'La fecha no puede ser mayor a 100 años';
                }
                return null;
            }
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
                { value: '', label: 'Select' },
                { value: 'M', label: 'Male' },
                { value: 'F', label: 'Female' },
                { value: 'O', label: 'Other' }
            ]
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
            ]
        },
        {
            name: 'documentNumber',
            label: 'ID Number',
            type: 'text',
            required: true,
        },
        {
            name: 'address',
            label: 'Address',
            type: 'text',
            required: true,
            fullWidth: true,
        },
        {
            name: 'bio',
            label: 'Bio',
            type: 'text',
            required: true,
            fullWidth: true,
        },
    ];

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
            </div>
        </div>
    );
}
