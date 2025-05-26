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
    const [editedAppointment, setEditedAppointment] = useState({
        appointmentDate: appointment.appointmentDate,
        status: appointment.status
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedAppointment);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Appointment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="datetime-local"
                            value={new Date(editedAppointment.appointmentDate).toISOString().slice(0, 16)}
                            onChange={(e) => setEditedAppointment({
                                ...editedAppointment,
                                appointmentDate: new Date(e.target.value).toISOString()
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={editedAppointment.status}
                            onChange={(e) => setEditedAppointment({
                                ...editedAppointment,
                                status: e.target.value
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAppointmentModal; 