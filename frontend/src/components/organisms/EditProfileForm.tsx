'use client'

import { useState } from 'react'
import { UserProfile } from '@/types/schemas'
import { useRouter } from 'next/navigation'
import { useUserServices } from '@/hooks/useUserServices'
import GenericForm, { FormField } from './GenericForm'
import { toast } from 'react-hot-toast'

type EditProfileFormProps = {
    initialData: UserProfile
}

export default function EditProfileForm({ initialData }: EditProfileFormProps) {
    const router = useRouter();
    const { updateUserProfile, isLoading, error, clearError } = useUserServices();

    const fields: FormField[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'Enter your email'
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'text',
            placeholder: 'Enter your phone number'
        },
        {
            name: 'birthDate',
            label: 'Birth Date',
            type: 'date',
            placeholder: 'Select your birth date'
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            options: [
                { value: 'M', label: 'Male' },
                { value: 'F', label: 'Female' },
                { value: 'O', label: 'Other' }
            ]
        },
        {
            name: 'address',
            label: 'Address',
            type: 'text',
            placeholder: 'Enter your address',
            fullWidth: true
        },
        {
            name: 'bio',
            label: 'Bio',
            type: 'text',
            placeholder: 'Tell us about yourself',
            fullWidth: true
        }
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        clearError();

        try {
            const formattedData: UserProfile = {
                name: formData.name || initialData.name,
                email: formData.email || initialData.email,
                phone: formData.phone || initialData.phone,
                gender: formData.gender || initialData.gender,
                address: formData.address || initialData.address,
                bio: formData.bio || initialData.bio,
                birthDate: formData.birthDate ? formData.birthDate.toString().split('T')[0] : initialData.birthDate
            };
            
            const success = await updateUserProfile(formattedData);
            
            if (success) {
                toast.success('Profile updated successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

            <GenericForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText={isLoading ? "Updating..." : "Save changes"}
                initialValues={initialData}
            />

            {error && (
                <div className="mt-4 text-red-500 text-sm p-2 bg-red-50 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
}