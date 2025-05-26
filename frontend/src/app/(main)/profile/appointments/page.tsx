'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes, FaEye, FaChevronLeft, FaChevronRight, FaSearch, FaPlus, FaTrash, FaSort } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DetailedAppointment, Appointment } from '@/types/schemas';
import { getSpecifiedAppointments, getAllAppointments, cancelAppointment, deleteAppointment, updateAppointment } from '@/services/AppointmentServices';
import AppointmentDetailsModal from '@/components/molecules/AppointmentDetailsModal';
import EditAppointmentModal from '@/components/molecules/EditAppointmentModal';
import { toast } from 'react-hot-toast';

type DateFilter = 'all' | 'today' | 'tomorrow' | 'next7days' | 'upcoming' | 'recent';

export default function VetAppointments() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<DetailedAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<DetailedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<DetailedAppointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<DetailedAppointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching appointments for role:', user?.role);
        const response = user?.role === 'Admin' || user?.role === 'Veterinario'
          ? await getAllAppointments(token)
          : await getSpecifiedAppointments(token);

        console.log('Appointments response:', response);

        if (response.success && response.data) {
          setAppointments(response.data);
          filterAppointments(response.data, dateFilter);
        } else {
          throw new Error(response.message || 'Error fetching appointments');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err instanceof Error ? err.message : 'Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const filterAppointments = (appointmentsToFilter: DetailedAppointment[], filter: DateFilter) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let filtered = [...appointmentsToFilter];

    switch (filter) {
      case 'today':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate.toDateString() === today.toDateString();
        });
        break;
      case 'tomorrow':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate.toDateString() === tomorrow.toDateString();
        });
        break;
      case 'next7days':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= today && appointmentDate <= nextWeek;
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= today;
        }).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    setFilteredAppointments(filtered);
  };

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    filterAppointments(appointments, filter);
    setCurrentPage(1);
  };

  const handleEdit = (appointment: DetailedAppointment) => {
    setEditingAppointment(appointment);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await deleteAppointment(token, id);
      if (response.success) {
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        toast.success('Appointment deleted successfully');
      } else {
        throw new Error(response.message || 'Error deleting appointment');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      toast.error(err instanceof Error ? err.message : 'Error deleting appointment');
    }
  };

  const handleSaveEdit = async (updatedAppointment: Partial<DetailedAppointment>) => {
    try {
      if (!editingAppointment?.id) {
        throw new Error('Invalid appointment ID');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const appointmentData: Partial<Appointment> = {
        status: updatedAppointment.status,
        appointmentDate: updatedAppointment.appointmentDate
      };

      console.log('Updating appointment:', {
        id: editingAppointment.id,
        data: appointmentData
      });

      const response = await updateAppointment(token, editingAppointment.id, appointmentData);

      if (response.success) {
        const updatedAppointments = appointments.map(appointment => 
          appointment.id === editingAppointment.id 
            ? { 
                ...appointment, 
                status: updatedAppointment.status || appointment.status,
                appointmentDate: updatedAppointment.appointmentDate || appointment.appointmentDate
              }
            : appointment
        );
        
        setAppointments(updatedAppointments);
        filterAppointments(updatedAppointments, dateFilter);
        
        setEditingAppointment(null);
        toast.success('Appointment updated successfully');
      } else {
        throw new Error(response.message || 'Error updating appointment');
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
      toast.error(err instanceof Error ? err.message : 'Error updating appointment');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const searchFilteredAppointments = filteredAppointments.filter(appointment => 
    appointment.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentAppointments = searchFilteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(searchFilteredAppointments.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold mb-6">Appointments Management</h1>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold mb-6">Appointments Management</h1>
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Appointments Management</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value as DateFilter)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            >
              <option value="all">All Appointments</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="next7days">Next 7 Days</option>
              <option value="upcoming">Upcoming</option>
              <option value="recent">Most Recent</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaSort className="h-4 w-4" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by pet name, service or status..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Pet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{appointment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.pet.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.service.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                        title="View Details"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                        title="Edit Appointment"
                      >
                        <FaEdit size={18} />
                      </button>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-rose-500 hover:text-rose-600 transition-colors"
                          title="Delete Appointment"
                        >
                          <FaTrash size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {searchTerm ? 'No appointments found matching your search' : 'No appointments registered'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {searchFilteredAppointments.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, searchFilteredAppointments.length)} of {searchFilteredAppointments.length} appointments
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

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}