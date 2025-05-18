'use client';   
import React, { useState, useEffect } from 'react';
import GenericForm, { FormField, FormFieldOption } from '@/components/organisms/GenericForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Button from '@/components/atoms/Button';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import Image from 'next/image';

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const MOCK_USER_PETS: FormFieldOption[] = [
    { value: 'firulais', label: 'Firulais' },
    { value: 'misu', label: 'Misu' },
    { value: 'rex', label: 'Rex' },
    { value: 'luna', label: 'Luna' },
];

const MOCK_SERVICES: FormFieldOption[] = [
    { value: 'grooming', label: 'Grooming Service' },
    { value: 'vaccine', label: 'Pet Vaccine' },
    { value: 'visit', label: 'Pet Visit' },
];

interface ScheduleAppointmentTemplateProps { }

const ScheduleAppointmentTemplate: React.FC<ScheduleAppointmentTemplateProps> = () => {
    const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date());
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDate && !(selectedDate instanceof Array)) {
            const MOCK_TIME_SLOTS = [
                '09:00 AM', '10:00 AM', '11:00 AM',
                '02:00 PM', '03:00 PM', '04:00 PM',
            ];
            setAvailableTimeSlots(MOCK_TIME_SLOTS);
            setSelectedTimeSlot(null);
        } else {
            setAvailableTimeSlots([]);
        }
    }, [selectedDate]);

    const handleDateChange = (value: CalendarValue) => {
        setSelectedDate(value);
    };

    const handleTimeSlotSelect = (timeSlot: string) => {
        setSelectedTimeSlot(timeSlot);
    };

    const appointmentFields: FormField[] = [
        {
            name: 'petId',
            label: 'Pet',
            type: 'select',
            required: true,
            options: MOCK_USER_PETS,
        },
        {
            name: 'serviceType',
            label: 'Service Type',
            type: 'select',
            required: true,
            options: MOCK_SERVICES,
        },
        {
            name: 'notes',
            label: 'Additional Notes',
            type: 'text',
            placeholder: 'Any special requests or information',
        },
    ];

    const handleAppointmentSubmit = (formData: Record<string, any>) => {
        if (!selectedDate || selectedDate instanceof Array) {
            alert('Please select a valid date.');
            return;
        }
        if (!selectedTimeSlot) {
            alert('Please select a time slot.');
            return;
        }
        const petField = appointmentFields.find(f => f.name === 'petId');
        if (petField && petField.required && !formData.petId) {
            alert('Please select a pet.');
            return;
        }
        const serviceField = appointmentFields.find(f => f.name === 'serviceType');
        if (serviceField && serviceField.required && !formData.serviceType) {
            alert('Please select a service type.');
            return;
        }

        const submissionData = {
            ...formData,
            appointmentDate: selectedDate.toISOString().split('T')[0],
            appointmentTime: selectedTimeSlot,
        };
        console.log('Appointment Form Submitted:', submissionData);
        const selectedPetObject = MOCK_USER_PETS.find(pet => pet.value === formData.petId);
        const petNameForAlert = selectedPetObject ? selectedPetObject.label : 'N/A';

        const selectedServiceObject = MOCK_SERVICES.find(service => service.value === formData.serviceType);
        const serviceNameForAlert = selectedServiceObject ? selectedServiceObject.label : 'N/A';

        alert(`Form submitted!\nPet: ${petNameForAlert}\nService: ${serviceNameForAlert}\nDate: ${submissionData.appointmentDate}\nTime: ${submissionData.appointmentTime}\nCheck the console for all data.`);
    };

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
                                />
                            </div>
                        </div>

                        <div className="md:w-1/2 space-y-6">
                            {selectedDate && !(selectedDate instanceof Array) && availableTimeSlots.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-black">2. Select an Available Time Slot</h2>
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
                                </div>
                            )}

                            {selectedDate && selectedTimeSlot && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-center md:text-left text-black">3. Appointment Details</h2>
                                    <GenericForm
                                        fields={appointmentFields}
                                        onSubmit={handleAppointmentSubmit}
                                        submitButtonText="Schedule Appointment"
                                        initialValues={{ petId: '', serviceType: '' }}
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