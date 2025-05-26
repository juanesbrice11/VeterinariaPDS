"use client";

import React, { useEffect, useState } from 'react';
import { getPets } from '@/services/PetServices';

interface Pet {
  id: number;
  name: string;
}

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: any) => void;
  record?: any;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  record
}) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [formData, setFormData] = useState({
    petId: '',
    date: '',
    description: '',
    procedureType: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        petId: record.petId.toString(),
        date: new Date(record.date).toISOString().split('T')[0],
        description: record.description,
        procedureType: record.procedureType
      });
    } else {
      setFormData({
        petId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        procedureType: ''
      });
    }
  }, [record]);

  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getPets(token);
          setPets(response.pets);
        } catch (error) {
          console.error('Error fetching pets:', error);
        }
      }
    };
    fetchPets();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      petId: parseInt(formData.petId)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {record ? 'Edit Medical Record' : 'Add Medical Record'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pet
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={formData.petId}
              onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              required
            >
              <option value="">Select a pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Procedure Type
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={formData.procedureType}
              onChange={(e) => setFormData({ ...formData, procedureType: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              {record ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordModal; 