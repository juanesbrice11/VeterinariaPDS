'use client'
import React, { useRef } from 'react'
import { loginUser } from "@/services/AuthServices"; 
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';
import Link from 'next/link';

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginUser({ email, password });
            if (data.token) {
                localStorage.setItem("token", data.token); 
                router.push("/"); 
                setError("");
            } else {
                setError(data.message || "Error al iniciar sesión");
            }
        } catch {
            setError("Error en el servidor");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
                    <div>
                        <label className="block text-sm font-medium">Usuario</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <Button
                        fullWidth
                        variant='primary'
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        Iniciar Sesión
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/password" className="text-blue-600 hover:underline text-sm">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
