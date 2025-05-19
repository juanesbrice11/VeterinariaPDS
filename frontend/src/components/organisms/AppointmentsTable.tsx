'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import { useRouter } from 'next/navigation';
import { Calendar, Trash2, AlertCircle } from 'lucide-react';
import { DetailedAppointment } from '@/types/schemas';
import { getSpecifiedAppointments } from '@/services/AppointmentServices';
import { toast } from 'react-hot-toast';

const getSpeciesEmoji = (species: string): string => {
    const speciesLower = species.toLowerCase();
    switch (speciesLower) {
        case 'dog': return '🐶';
        case 'cat': return '🐱';
        case 'bird': return '🦜';
        case 'fish': return '🐠';
        case 'rabbit': return '🐇';
        case 'hamster': return '🐹';
        case 'turtle': return '🐢';
        default: return '🐾';
    }
};


const MOCK_APPOINTMENTS = [
    {
        id: '1',
        type: 'General Checkup',
        pet: {
            id: '1',
            name: 'Firulais',
            imageUrl: 'https://via.placeholder.com/40/FFE9D2/000000?Text=F'
        },
        status: 'Pending',
        date: '2024-04-15T10:00:00'
    },
    {
        id: '2',
        type: 'Vaccination',
        pet: {
            id: '2',
            name: 'Misu',
            imageUrl: 'https://via.placeholder.com/40/E2F0FB/000000?Text=M'
        },
        status: 'Completed',
        date: '2024-04-10T15:30:00'
    }
];


export default function AppointmentsTable() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<DetailedAppointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found');
                return;
            }

            try {
                const response = await getSpecifiedAppointments(token);
                if (response.success && response.data) {
                    setAppointments(response.data);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error('Error loading appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    const handleReschedule = (appointmentId: number) => {
        // Aquí irá la lógica para reagendar la cita
        console.log('Rescheduling appointment:', appointmentId);
    };

    const handleCancel = (appointmentId: number) => {
        // Aquí irá la lógica para cancelar la cita
        console.log('Cancelling appointment:', appointmentId);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-black">Your Next Meetings</h2>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/schedule-appointment')}
                    >
                        Schedule New Meeting
                    </Button>
                </div>
                {appointments.length === 0 ?
                    <div className="text-center p-8">
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                    :
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pet
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment.service.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="h-10 w-10 rounded-full flex items-center justify-center bg-[#FFE9D2] text-2xl">
                                                    {getSpeciesEmoji(appointment.pet.species)}
                                                </span>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.pet.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(appointment.appointmentDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-3">
                                                {appointment.status.toLowerCase() !== 'completed' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleReschedule(appointment.id)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Reschedule appointment"
                                                        >
                                                            <Calendar className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(appointment.id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Cancel appointment"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.status.toLowerCase() === 'completed' && (
                                                    <span className="text-gray-400" title="No actions available">
                                                        <AlertCircle className="h-5 w-5" />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </>
    );
} 