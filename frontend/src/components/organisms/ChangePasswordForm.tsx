'use client'

import { useState } from 'react'
import Button from '../atoms/Button'
import { useUserServices } from '@/hooks/useUserServices'

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [success, setSuccess] = useState('')
    const { changePassword, isLoading, error, clearError } = useUserServices()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        setSuccess('')

        if (newPassword !== confirmPassword) {
            clearError()
            return
        }

        if (newPassword.length < 8) {
            clearError()
            return
        }

        try {
            const success = await changePassword(currentPassword, newPassword);
            
            if (success) {
                setSuccess('Password changed successfully')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
        } catch (err) {
            console.error('Error changing password:', err)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A3287]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A3287]"
                        required
                        minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A3287] ${
                            confirmPassword && newPassword !== confirmPassword 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`}
                        required
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                </div>

                {error && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-600 text-sm p-2 bg-green-50 rounded-md">
                        {success}
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        variant="primary"
                        disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                </div>
            </form>
        </div>
    )
}