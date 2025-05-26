'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes, FaEye, FaChevronLeft, FaChevronRight, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DetailedAppointment } from '@/types/schemas';
import { getSpecifiedAppointments, getAllAppointments, cancelAppointment, deleteAppointment, updateAppointment } from '@/services/AppointmentServices';
import AppointmentDetailsModal from '@/components/molecules/AppointmentDetailsModal';
import EditAppointmentModal from '@/components/molecules/EditAppointmentModal';
import { toast } from 'react-hot-toast';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<DetailedAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<DetailedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<DetailedAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAppointments();
  }, [user, router]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = user?.role === 'Admin' 
        ? await getAllAppointments(user?.token || '')
        : await getSpecifiedAppointments(user?.token || '');
      
      if (response.success && response.data) {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } else {
        toast.error(response.message || 'Error fetching appointments');
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    
    filterAppointments(value, dateFilter);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setDateFilter(filter);
    setCurrentPage(1);
    
    filterAppointments(searchTerm, filter);
  };

  const filterAppointments = (search: string, dateFilter: string) => {
    let filtered = appointments;

    // Filter by search term
    if (search.trim()) {
      filtered = filtered.filter(appointment => 
        appointment.pet.name.toLowerCase().includes(search.toLowerCase()) ||
        appointment.service.title.toLowerCase().includes(search.toLowerCase()) ||
        appointment.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by date
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate.toDateString() === now.toDateString();
        });
        break;
      case 'tomorrow':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate.toDateString() === tomorrow.toDateString();
        });
        break;
      case 'week':
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= now && appointmentDate <= weekEnd;
        });
        break;
      case 'month':
        const monthEnd = new Date(now);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= now && appointmentDate <= monthEnd;
        });
        break;
      case 'past':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate < now;
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate > now;
        });
        break;
    }

    setFilteredAppointments(filtered);
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

  // Pagination logic
  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold mb-6">Appointment Management</h1>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Appointment Management</h1>
        
        <div className="flex items-center space-x-4">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={handleDateFilter}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">Next 7 Days</option>
            <option value="month">Next 30 Days</option>
            <option value="past">Past Appointments</option>
            <option value="upcoming">Upcoming Appointments</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by pet name, service or client..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
            />
          </div>

          {user?.role !== 'Admin' && (
            <button 
              onClick={() => router.push('/appointments/new')}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center space-x-2"
            >
              <FaPlus />
              <span>New Appointment</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Date and Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Pet</th>
              {user?.role === 'Admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Client</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Veterinarian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(appointment.appointmentDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.pet.name}</div>
                  </td>
                  {user?.role === 'Admin' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.user.name}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.veterinarian ? appointment.veterinarian.name : 'No assigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye size={18} />
                      </button>
                      {(user?.role === 'Admin' || appointment.status === 'Pending') && (
                        <>
                          <button
                            onClick={() => handleEditAppointment(appointment)}
                            className="text-amber-600 hover:text-amber-700 transition-colors"
                            title="Edit Appointment"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-rose-500 hover:text-rose-600 transition-colors"
                            title="Delete Appointment"
                          >
                            <FaTrash size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {searchTerm ? 'No appointments found matching your search' : 'No appointments registered'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAppointments.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length} appointments
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
              Page {currentPage} of {totalPages}
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

      {/* Appointment Details Modal */}
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
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this appointment? This action cannot be undone.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}