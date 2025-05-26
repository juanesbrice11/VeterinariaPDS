'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ServiceCardProps {
    id: string;
    icon?: string;
    title: string;
    description: string;
    bgColor?: string;
}

export default function ServiceCard({ id, icon, title, description, bgColor = 'bg-white' }: ServiceCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            setContentHeight(containerRef.current.scrollHeight);
        }
    }, [description]);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleBookNow = () => {
        router.push('/appointments');
    };

    // Función para determinar si el icono es un emoji
    const isEmoji = (str: string) => {
        return str && str.length <= 2 && /\p{Emoji}/u.test(str);
    };

    return (
        <>
            <div
                className={`relative flex flex-col items-center text-center p-6 rounded-full shadow-md ${bgColor} w-64 font-instrument overflow-hidden transition-all duration-500 hover:z-20 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                style={{
                    height: isHovered ? contentHeight ?? 'auto' : 256, // 256px = h-64
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                ref={containerRef}
            >
                {icon && (
                    isEmoji(icon) ? (
                        <span className="text-4xl mb-4">{icon}</span>
                    ) : (
                        <img
                            src={icon}
                            alt={title}
                            className="w-16 h-16 mb-4 object-contain"
                        />
                    )
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    {icon && (
                                        isEmoji(icon) ? (
                                            <span className="text-4xl">{icon}</span>
                                        ) : (
                                            <img
                                                src={icon}
                                                alt={title}
                                                className="w-16 h-16 object-contain"
                                            />
                                        )
                                    )}
                                    <h2 className="text-2xl font-bold text-[#150B33]">{title}</h2>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#FB7B53] mb-2">Description</h3>
                                    <p className="text-gray-600">{description}</p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-[#FB7B53] mb-2">Duration</h3>
                                    <p className="text-gray-600">Approximately 1-2 hours</p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleBookNow}
                                        className="flex-1 bg-[#FB7B53] text-white py-3 px-6 rounded-xl hover:bg-[#e56a42] transition-colors"
                                    >
                                        Book Now
                                    </button>
                                    <button className="flex-1 border-2 border-[#FB7B53] text-[#FB7B53] py-3 px-6 rounded-xl hover:bg-[#FB7B53] hover:text-white transition-colors">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
