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
            return 'La contraseña debe tener al menos 8 caracteres';
        }
        if (!/[A-Z]/.test(value)) {
            return 'La contraseña debe contener al menos una letra mayúscula';
        }
        if (!/[a-z]/.test(value)) {
            return 'La contraseña debe contener al menos una letra minúscula';
        }
        if (!/[0-9]/.test(value)) {
            return 'La contraseña debe contener al menos un número';
        }
        if (!/[!@#$%^&*]/.test(value)) {
            return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)';
        }
        return null;
    };

    const fields: FormField[] = [
        {
            name: 'currentPassword',
            label: 'Contraseña Actual',
            type: showCurrentPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Ingresa tu contraseña actual',
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowCurrentPassword(!showCurrentPassword)
        },
        {
            name: 'newPassword',
            label: 'Nueva Contraseña',
            type: showNewPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Ingresa tu nueva contraseña',
            validation: validatePassword,
            fullWidth: true,
            showPasswordToggle: true,
            onTogglePassword: () => setShowNewPassword(!showNewPassword)
        },
        {
            name: 'confirmPassword',
            label: 'Confirmar Nueva Contraseña',
            type: showConfirmPassword ? 'text' : 'password',
            required: true,
            placeholder: 'Confirma tu nueva contraseña',
            validation: (value: string, formData?: Record<string, any>) => {
                if (!formData?.newPassword) return 'Falta la nueva contraseña';
                if (value !== formData.newPassword) {
                    return 'Las contraseñas no coinciden';
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
            setFormError('Las contraseñas no coinciden');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setFormError('No se encontró el token de autenticación');
            return;
        }

        try {
            const response = await updatePassword(formData.currentPassword, formData.newPassword, token);
            
            if (response.error) {
                setFormError(response.error);
                return;
            }

            toast.success('Contraseña actualizada exitosamente');
            window.location.reload();
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            setFormError('Error al actualizar la contraseña');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Cambiar Contraseña</h2>
            
            <div className="mb-4 text-sm text-gray-600">
                <p>La contraseña debe cumplir con los siguientes requisitos:</p>
                <ul className="list-disc list-inside mt-2">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un carácter especial (!@#$%^&*)</li>
                </ul>
            </div>

            <GenericForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText="Actualizar Contraseña"
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