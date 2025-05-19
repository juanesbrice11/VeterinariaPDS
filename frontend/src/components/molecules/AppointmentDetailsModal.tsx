import React from 'react';
import { DetailedAppointment } from '@/types/schemas';
import { FaTimes } from 'react-icons/fa';

interface AppointmentDetailsModalProps {
    appointment: DetailedAppointment;
    onClose: () => void;
}

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
        dateStyle: 'full',
        timeStyle: 'short'
    }).format(date);
};

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

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ appointment, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/10 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Status and Date */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`mt-1 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date & Time</p>
                                    <p className="mt-1 text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Service</p>
                                    <p className="mt-1 text-gray-900 font-medium">{appointment.service.title}</p>
                                    <p className="mt-1 text-gray-600">{appointment.service.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pet Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pet Information</h3>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-[#FFE9D2] flex items-center justify-center text-4xl">
                                    {getSpeciesEmoji(appointment.pet.species)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{appointment.pet.name}</h4>
                                    <p className="text-gray-600 capitalize">{appointment.pet.species} {appointment.pet.breed ? `- ${appointment.pet.breed}` : ''}</p>
                                    <p className="text-sm text-gray-500">ID: #{appointment.pet.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Owner Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Owner Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="mt-1 text-gray-900">{appointment.user.name}</p>
                                </div>
                                {appointment.user.email && (
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="mt-1 text-gray-900">{appointment.user.email}</p>
                                    </div>
                                )}
                                {appointment.user.phone && (
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="mt-1 text-gray-900">{appointment.user.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Veterinarian Information */}
                        {appointment.veterinarian && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Veterinarian Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="mt-1 text-gray-900">{appointment.veterinarian.name}</p>
                                    </div>
                                    {appointment.veterinarian.email && (
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="mt-1 text-gray-900">{appointment.veterinarian.email}</p>
                                        </div>
                                    )}
                                    {appointment.veterinarian.phone && (
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="mt-1 text-gray-900">{appointment.veterinarian.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppointmentDetailsModal; 