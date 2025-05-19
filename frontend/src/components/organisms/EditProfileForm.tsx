'use client'
import React from 'react';
import GenericForm, { FormField } from './GenericForm';
import { UserProfile } from '@/types/schemas';
import { updateUser } from '@/services/UserServices';
import { toast } from 'react-hot-toast';

interface EditProfileFormProps {
    initialData: UserProfile;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData }) => {
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
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'text',
            required: true,
            placeholder: 'Enter your phone number',
        },
        {
            name: 'birthDate',
            label: 'Birth Date',
            type: 'date',
            required: true,
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
            ]
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
            placeholder: 'Tell us about yourself',
            fullWidth: true
        }
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication token not found');
            return;
        }

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

            const response = await updateUser(formattedData, token);
            
            if (response.success) {
                toast.success(response.message);
                setTimeout(() => window.location.reload(), 3000);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Server error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            <GenericForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText="Save Changes"
                initialValues={initialData}
            />
        </div>
    );
};

export default EditProfileForm;