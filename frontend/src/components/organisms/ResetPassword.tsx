'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '@/services/AuthServices';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await requestPasswordReset(email);
            setMessage(response.message || "Revisa tu correo electrónico");
            setError("");
        } catch (err: any) {
            setError(err.message || "Error al solicitar el reestablecimiento");
            setMessage("");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6">Reestablecer Contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Enviar enlace de recuperación
                    </button>
                </form>

                {message && <p className="mt-4 text-green-500">{message}</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
