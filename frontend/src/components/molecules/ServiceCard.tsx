'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Importa el router

interface ServiceCardProps {
    id: string;
    icon?: string;
    title: string;
    description: string;
    bgColor?: string;
}

export default function ServiceCard({ id, icon, title, description, bgColor = 'bg-white' }: ServiceCardProps) {
    const router = useRouter(); // 👈 Hook del router
    const [isHovered, setIsHovered] = useState(false);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            setContentHeight(containerRef.current.scrollHeight);
        }
    }, [description]);

    const handleClick = () => {
        router.push(`/services/${id}`); // 👈 Navegación dinámica
    };

    return (
        <div
            className={`relative flex flex-col items-center text-center p-6 rounded-full shadow-md ${bgColor} w-64 font-instrument overflow-hidden transition-all duration-500 hover:z-20 hover:scale-105 hover:shadow-2xl cursor-pointer`}
            style={{
                height: isHovered ? contentHeight ?? 'auto' : 256, // 256px = h-64
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick} // 👈 Ejecuta navegación al hacer clic
            ref={containerRef}
        >
            {icon && (
                <img
                    src={icon}
                    alt={title}
                    className="w-16 h-16 mb-4 object-contain"
                />
            )}
            <h3 className="text-xl font-bold mb-2 text-[#150B33] break-words">{title}</h3>

            <p
                className={`px-4 py-2 text-sm text-[#150B33] break-words transition-all duration-300 ${isHovered ? '' : 'line-clamp-2 overflow-hidden'
                    } mb-4`}
                style={{ whiteSpace: 'pre-line' }}
            >
                {description}
            </p>
        </div>
    );
}
