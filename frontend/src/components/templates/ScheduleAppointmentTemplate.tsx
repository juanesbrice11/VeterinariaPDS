'use client';
import React, { useState, useEffect } from 'react';
import GenericForm, { FormField, FormFieldOption } from '@/components/organisms/GenericForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Button from '@/components/atoms/Button';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import Image from 'next/image';
import { getServices } from '@/services/OptionServices';
import { toast } from 'react-hot-toast';
import { Pet, Service, Appointment } from '@/types/schemas';
import { getPets } from '@/services/PetServices';
import { createAppointment, getAvailableTimeSlots } from '@/services/AppointmentServices';
import { useAuth } from '@/context/AuthContext';

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];


interface ScheduleAppointmentTemplateProps { }

const ScheduleAppointmentTemplate: React.FC<ScheduleAppointmentTemplateProps> = () => {
    const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date());
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState<Pet[]>([]);
    const token = localStorage.getItem('token');
    const { user } = useAuth();

    useEffect(() => {
        if (!token) {
            return;
        }
        const fetchServices = async () => {
            const response = await getServices(token);
            if (response.success && response.services) {
                setServices(response.services);
            } else {
                if (response.message) {
                    toast.error(response.message);
                }
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }
        const fetchUserPets = async () => {
            const response = await getPets(token);
            if (response.success && response.pets) {
                setPets(response.pets);
            } else {
                if (response.message) {
                    toast.error(response.message);
                }
            }
            setLoading(false);
        };
        fetchUserPets();
    }, []);

    useEffect(() => {
        if (selectedDate && !(selectedDate instanceof Array)) {
            const fetchAvailableSlots = async () => {
                if (!token) {
                    return;
                }
                const response = await getAvailableTimeSlots(selectedDate.toISOString().split('T')[0], token);
                if (response.success && response.data) {
                    let availableSlots = response.data.availableTimeSlots;

                    // Filter time slots if selected date is today
                    const now = new Date();
                    const isToday = selectedDate.getDate() === now.getDate() &&
                        selectedDate.getMonth() === now.getMonth() &&
                        selectedDate.getFullYear() === now.getFullYear();

                    if (isToday) {
                        availableSlots = availableSlots.filter(slot => {
                            const [hours, minutes] = slot.split(':').map(Number);
                            const slotTime = new Date(selectedDate);
                            slotTime.setHours(hours, minutes, 0, 0);
                            return slotTime > now;
                        });
                    }

                    setAvailableTimeSlots(availableSlots);
                } else {
                    if (response.message) {
                        toast.error(response.message);
                    }
                }
            };
            fetchAvailableSlots();
        } else {
            setAvailableTimeSlots([]);
        }
    }, [selectedDate, token]);

    const handleDateChange = (value: CalendarValue) => {
        setSelectedDate(value);
    };

    const handleTimeSlotSelect = (timeSlot: string) => {
        setSelectedTimeSlot(timeSlot);
    };

    const serviceOptions: FormFieldOption[] = services.map(service => ({
        value: service.id.toString(),
        label: service.title
    }));

    const petOptions: FormFieldOption[] = pets.map(pet => ({
        value: pet.id.toString(),
        label: pet.name
    }));

    const appointmentFields: FormField[] = [
        {
            name: 'petId',
            label: 'Pet',
            type: 'select',
            required: true,
            options: petOptions,
        },
        {
            name: 'serviceId',
            label: 'Service Type',
            type: 'select',
            required: true,
            options: serviceOptions,
        },
        {
            name: 'notes',
            label: 'Additional Notes',
            type: 'text',
            placeholder: 'Any special requests or information',
        },
    ];

    const handleAppointmentSubmit = async (formData: Record<string, any>) => {
        if (!user) {
            toast.error('Authentication required to schedule appointments');
            return;
        }

        if (!selectedDate || selectedDate instanceof Array) {
            toast.error('Please select a valid date');
            return;
        }
        if (!selectedTimeSlot) {
            toast.error('Please select a time slot');
            return;
        }
        const petField = appointmentFields.find(f => f.name === 'petId');
        if (petField && petField.required && !formData.petId) {
            toast.error('Please select a pet');
            return;
        }
        const serviceField = appointmentFields.find(f => f.name === 'serviceId');
        if (serviceField && serviceField.required && !formData.serviceId) {
            toast.error('Please select a service type');
            return;
        }

        if (!token) {
            toast.error('No active session');
            return;
        }

        const [hours, minutes] = selectedTimeSlot.split(':');
        const appointmentDateTime = new Date(selectedDate);
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const appointmentData = {
            petId: parseInt(formData.petId),
            serviceId: parseInt(formData.serviceId),
            appointmentDate: appointmentDateTime.toISOString(),
            status: 'Pending',
            userId: user.id,
            notes: formData.notes || ''
        };

        try {
            const response = await createAppointment(token, appointmentData);

            if (response.success) {
                const selectedPetObject = pets.find(pet => pet.id.toString() === formData.petId);
                const petNameForAlert = selectedPetObject ? selectedPetObject.name : 'N/A';

                const selectedServiceObject = services.find(service => service.id.toString() === formData.serviceId);
                const serviceNameForAlert = selectedServiceObject ? selectedServiceObject.title : 'N/A';

                const formattedDate = appointmentDateTime.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                toast.success(`Appointment scheduled successfully!\nPet: ${petNameForAlert}\nService: ${serviceNameForAlert}\nDate: ${formattedDate}\nTime: ${selectedTimeSlot}`);
            } else {
                toast.error(response.message || 'Error scheduling appointment');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('Error scheduling appointment');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen relative">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading services...</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/assets/Background.png"
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    priority
                />
            </div>

            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
                    <h1 className="text-3xl font-bold mb-8 text-center text-black">Schedule New Appointment</h1>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2 flex-shrink-0">
                            <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-black">1. Select a Date</h2>
                            <div className="flex justify-center md:justify-start">
                                <Calendar
                                    onChange={handleDateChange}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    className="rounded-lg shadow-sm border border-gray-200 text-black"
                                    locale="en-US"
                                />
                            </div>
                        </div>

                        <div className="md:w-1/2 space-y-6">
                            {selectedDate && !(selectedDate instanceof Array) && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-black">2. Select an Available Time Slot</h2>
                                    {availableTimeSlots.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {availableTimeSlots.map((slot) => (
                                                <Button
                                                    key={slot}
                                                    onClick={() => handleTimeSlotSelect(slot)}
                                                    variant={selectedTimeSlot === slot ? 'primary' : 'secondary'}
                                                    fullWidth
                                                >
                                                    {slot}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-600">No available time slots for this date. Please select another date.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedDate && selectedTimeSlot && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-black">3. Appointment Details</h2>
                                    <GenericForm
                                        fields={appointmentFields}
                                        onSubmit={handleAppointmentSubmit}
                                        submitButtonText="Schedule Appointment"
                                        initialValues={{ petId: '', serviceId: '' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ScheduleAppointmentTemplate; 