'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSpecifiedAppointments } from '@/services/AppointmentServices';
import { DetailedAppointment } from '@/types/schemas';
import { toast } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const [appointment, setAppointment] = useState<DetailedAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAppointment();
  }, [user, router]);

  const fetchAppointment = async () => {
    try {
      const response = await getSpecifiedAppointments(user?.token || '');
      if (response.success && response.data) {
        const foundAppointment = response.data.find(a => a.id === parseInt(params.id));
        if (foundAppointment) {
          setAppointment(foundAppointment);
        } else {
          toast.error('Appointment not found');
          router.push('/profile/appointments');
        }
      } else {
        toast.error(response.message || 'Error fetching appointment');
        router.push('/profile/appointments');
      }
    } catch (error) {
      toast.error('Error fetching appointment');
      router.push('/profile/appointments');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Not Found</h2>
          <p className="text-gray-600 mb-6">The appointment you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/profile/appointments')}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Return to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.push('/profile/appointments')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Appointments
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Appointment Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="mt-1 text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="mt-1 text-gray-900 font-medium">{appointment.service.title}</p>
                  <p className="mt-1 text-gray-600">{appointment.service.description}</p>
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pet Information</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[#FFE9D2] flex items-center justify-center text-4xl">
                  {getSpeciesEmoji(appointment.pet.species)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{appointment.pet.name}</h3>
                  <p className="text-gray-600 capitalize">{appointment.pet.species} {appointment.pet.breed ? `- ${appointment.pet.breed}` : ''}</p>
                  <p className="text-sm text-gray-500">ID: #{appointment.pet.id}</p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h2>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Veterinarian Information</h2>
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
    </div>
  );
} 