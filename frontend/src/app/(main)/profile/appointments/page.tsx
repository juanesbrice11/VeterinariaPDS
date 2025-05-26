'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DetailedAppointment } from '@/types/schemas';
import { getSpecifiedAppointments, getAllAppointments, cancelAppointment, deleteAppointment, updateAppointment } from '@/services/AppointmentServices';
import AppointmentDetailsModal from '@/components/molecules/AppointmentDetailsModal';
import EditAppointmentModal from '@/components/molecules/EditAppointmentModal';
import { toast } from 'react-hot-toast';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<DetailedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<DetailedAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  console.log('Component rendered, user:', user);

  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }
    console.log('User found, calling fetchAppointments');
    fetchAppointments();
  }, [user, router]);

  const fetchAppointments = async () => {
    console.log('fetchAppointments started');
    try {
      console.log('User data:', {
        token: user?.token,
        role: user?.role,
        id: user?.id
      });
      
      const response = user?.role === 'Admin' 
        ? await getAllAppointments(user?.token || '')
        : await getSpecifiedAppointments(user?.token || '');
      
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        setAppointments(response.data);
      } else {
        console.log('Error in response:', response);
        toast.error(response.message || 'Error fetching appointments');
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAppointment = (appointment: DetailedAppointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleEditAppointment = (appointment: DetailedAppointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDeleteAppointment = async (appointment: DetailedAppointment) => {
    try {
      const response = user?.role === 'Admin'
        ? await deleteAppointment(user?.token || '', appointment.id)
        : await cancelAppointment(user?.token || '', appointment.id);

      if (response.success) {
        toast.success(user?.role === 'Admin' ? 'Appointment deleted successfully' : 'Appointment cancelled successfully');
        fetchAppointments();
      } else {
        toast.error(response.message || `Error ${user?.role === 'Admin' ? 'deleting' : 'cancelling'} appointment`);
      }
    } catch (error) {
      toast.error(`Error ${user?.role === 'Admin' ? 'deleting' : 'cancelling'} appointment`);
    }
    setShowDeleteConfirm(false);
  };

  const handleUpdateAppointment = async (updatedAppointment: Partial<DetailedAppointment>) => {
    if (!selectedAppointment || !user?.token) return;

    try {
      const response = await updateAppointment(
        user.token,
        selectedAppointment.id,
        updatedAppointment
      );

      if (response.success) {
        toast.success('Appointment updated successfully');
        fetchAppointments();
        setShowEditModal(false);
      } else {
        toast.error(response.message || 'Error updating appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Error updating appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
    // ... existing code ...
  };

  // Pagination logic
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{user?.role === 'Admin' ? 'All Appointments' : 'My Appointments'}</h1>
        {user?.role !== 'Admin' && (
          <button 
            onClick={() => router.push('/appointments/new')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Schedule New Appointment
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Pet</th>
                {user?.role === 'Admin' && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Owner</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Veterinarian</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(appointment.appointmentDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.pet.name}</td>
                    {user?.role === 'Admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.user.name}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.service.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.veterinarian ? appointment.veterinarian.name : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEye />
                      </button>
                      {(user?.role === 'Admin' || appointment.status === 'Pending') && (
                        <>
                          <button 
                            onClick={() => handleEditAppointment(appointment)}
                            className="text-yellow-600 hover:text-yellow-900 mr-4"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedAppointment && showDetailsModal && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {selectedAppointment && showEditModal && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
          }}
          onSave={handleUpdateAppointment}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user?.role === 'Admin' ? 'Confirm Deletion' : 'Confirm Cancellation'}
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'Admin' 
                ? 'Are you sure you want to delete this appointment? This action cannot be undone.'
                : 'Are you sure you want to cancel this appointment? This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAppointment(selectedAppointment)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                {user?.role === 'Admin' ? 'Delete' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {appointments.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {indexOfFirstAppointment + 1} a {Math.min(indexOfLastAppointment, appointments.length)} de {appointments.length} citas
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 