import React, { useState } from 'react';
import { DetailedAppointment } from '@/types/schemas';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

interface EditAppointmentModalProps {
    appointment: DetailedAppointment;
    onClose: () => void;
    onSave: (updatedAppointment: Partial<DetailedAppointment>) => void;
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

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ appointment, onClose, onSave }) => {
    const [editedAppointment, setEditedAppointment] = useState<Partial<DetailedAppointment>>({
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        veterinarianId: appointment.veterinarian?.id
    });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedAppointment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedAppointment);
        setShowConfirmation(true);
        
        setTimeout(() => {
            setShowConfirmation(false);
            onClose();
        }, 2000);
    };

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
                    {/* Confirmation Message */}
                    {showConfirmation && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-lg animate-fade-in">
                            <div className="text-center">
                                <FaCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Changes Saved!</h3>
                                <p className="text-gray-600">The appointment has been updated successfully.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Appointment Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Information</h3>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="appointmentDate"
                                        value={editedAppointment.appointmentDate ? new Date(editedAppointment.appointmentDate).toISOString().slice(0, 16) : ''}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={editedAppointment.status}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Read-only Information */}
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

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pet Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Pet Name</p>
                                    <p className="mt-1 text-gray-900">{appointment.pet.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Species & Breed</p>
                                    <p className="mt-1 text-gray-900 capitalize">{appointment.pet.species} {appointment.pet.breed ? `- ${appointment.pet.breed}` : ''}</p>
                                </div>
                            </div>
                        </div>

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
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditAppointmentModal; 