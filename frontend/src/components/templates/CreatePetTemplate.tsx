'use client'
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import FileInput from '@/components/atoms/FileInput';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useUserServices } from '@/hooks/useUserServices';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/context/AuthContext';
import { createPet } from '@/services/PetServices';
import { Pet } from '@/types/schemas';

const CreatePetTemplate = () => {
    const { isLoading } = useUserServices();
    const { user } = useAuth(); // Get the current user
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({
        name: '',
        species: '',
        breed: '',
        color: '',
        gender: '',
        weight: ''
    });
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const genderOptions = [
        { value: '', label: 'Select' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ];

    const speciesOptions = [
        { value: '', label: 'Select' },
        { value: 'Dog', label: 'Dog' },
        { value: 'Cat', label: 'Cat' },
        { value: 'Bird', label: 'Bird' },
        { value: 'Reptile', label: 'Reptile' },
        { value: 'Other', label: 'Other' }
    ];

    const handleImageChange = (file: File | null) => {
        setSelectedImage(file);
    };

    const handleDateChange = (date: any) => {
        if (date instanceof Date) {
            setSelectedDate(date);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string | undefined> = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.species) {
            newErrors.species = 'Species is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        if (!user || !user.id) {
            toast.error('User information not available. Please log in again.');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('You must be logged in to create a pet');
            return;
        }

        setIsSubmitting(true);

        try {
            interface PetWithOwner extends Pet {
                ownerId: number;
            }

            const petBase: PetWithOwner = {
                name: formData.name,
                species: formData.species,
                ownerId: user.id
            };

            if (formData.breed) petBase.breed = formData.breed;
            if (formData.color) petBase.color = formData.color;
            if (formData.gender) {
                if (formData.gender === 'Male') petBase.gender = 'M';
                else if (formData.gender === 'Female') petBase.gender = 'F';
                else petBase.gender = formData.gender;
            }

            if (formData.weight && formData.weight !== '') {
                petBase.weight = parseFloat(formData.weight);
            }

            if (selectedDate) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                petBase.birthDate = `${year}-${month}-${day}`;
            }

            if (petBase.species) {
                petBase.species = petBase.species.charAt(0).toUpperCase() +
                    petBase.species.slice(1).toLowerCase();
            }

            if (petBase.breed) {
                petBase.breed = petBase.breed.charAt(0).toUpperCase() +
                    petBase.breed.slice(1).toLowerCase();
            }

            const response = await createPet(petBase, token, selectedImage || undefined);

            if (response.error) {
                throw new Error(response.error);
            }

            setFormData({
                name: '',
                species: '',
                breed: '',
                color: '',
                gender: '',
                weight: ''
            });
            setSelectedDate(null);
            setSelectedImage(null);
            
            toast.success('Pet created successfully', {
                duration: 4000,
                position: 'top-center',
            });

        } catch (error) {
            console.error('Error creating pet:', error);
            toast.error(error instanceof Error ? error.message : 'Error creating pet', {
                duration: 4000,
                position: 'top-center',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-grow w-full max-w-6xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Register New Pet</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <Input
                                label="Name"
                                name="name"
                                type="text"
                                placeholder="Pet name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                                className="text-black"
                            />
                        </div>
                        <div>
                            <Select
                                label="Species"
                                name="species"
                                options={speciesOptions}
                                value={formData.species}
                                onChange={handleChange}
                                error={errors.species}
                                required
                                className="text-black"
                            />
                        </div>

                        <div>
                            <Input
                                label="Breed"
                                name="breed"
                                type="text"
                                placeholder="Pet breed"
                                value={formData.breed}
                                onChange={handleChange}
                                className="text-black"
                            />
                        </div>
                        <div>
                            <Input
                                label="Color"
                                name="color"
                                type="text"
                                placeholder="Pet color"
                                value={formData.color}
                                onChange={handleChange}
                                className="text-black"
                            />
                        </div>

                        <div>
                            <Select
                                label="Gender"
                                name="gender"
                                options={genderOptions}
                                value={formData.gender}
                                onChange={handleChange}
                                className="text-black"
                            />
                        </div>
                        <div>
                            <Input
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                placeholder="Weight in kilograms"
                                value={formData.weight}
                                onChange={handleChange}
                                className="text-black"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                maxDate={new Date()}
                                className="w-full border border-gray-300 rounded-md p-2 text-black"
                            />
                        </div>

                        <div>
                            <FileInput
                                label="Pet photo (optional)"
                                onChange={handleImageChange}
                                value={selectedImage}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth={true}
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? "Creating..." : "Register Pet"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreatePetTemplate; 