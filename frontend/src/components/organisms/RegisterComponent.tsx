import React from 'react'
import { useState } from "react";
import { registerUser } from "@/services/AuthServices"; 

export default function RegisterComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [documentType, setDocumentType] = useState("CC"); 
    const [documentNumber, setDocumentNumber] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            password,
            documentType,
            documentNumber,
            status: "Active", 
            role: "Guest"     
        };

        try {
            const data = await registerUser(userData);
            if (data.message) {
                setMessage(data.message);
                setError("");
            } else {
                setError(data.error || "Error al registrarse");
            }
        } catch {
            setError("Error en el servidor");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-6">Registrarse</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
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
                    <div>
                        <label className="block text-sm font-medium">Tipo de Documento</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        >
                            <option value="CC">CC</option>
                            <option value="TI">TI</option>
                            <option value="CE">CE</option>
                            {/* Puedes agregar más opciones según sea necesario */}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Número de Documento</label>
                        <input
                            type="text"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        Registrarse
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {message && <p className="mt-4 text-green-500">{message}</p>}
            </div>
        </div>
    );
}
