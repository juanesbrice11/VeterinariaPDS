'use client'
import React, { useRef } from 'react'
import { loginUser } from "@/services/AuthServices"; 
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const data = await loginUser({ email, password });
            
            if (data.token) {
                const isValid = await login(data.token);
                
                if (isValid) {
                    router.push("/"); 
                    setError("");
                } else {
                    setError("Authentication error: Invalid or expired token");
                }
            } else {
                setError(data.message || "Error logging in");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
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
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/password" className="text-blue-600 hover:underline text-sm">
                        Forgot your password?
                    </Link>
                </div>

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
