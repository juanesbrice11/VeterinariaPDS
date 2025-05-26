"use client";

import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, Eye, AlertCircle } from 'lucide-react';
import MedicalRecordModal from '@/components/molecules/MedicalRecordModal';
import { 
  getMedicalRecords, 
  createMedicalRecord, 
  updateMedicalRecord, 
  deleteMedicalRecord 
} from '@/services/MedicalRecordServices';
import Button from '@/components/atoms/Button';

interface MedicalRecord {
  id: number;
  petId: number;
  petName: string;
  date: string;
  description: string;
  procedureType: string;
  veterinarianId: number;
  veterinarianName: string;
}

const getProcedureEmoji = (procedureType: string): string => {
    const typeLower = procedureType.toLowerCase();
    switch (typeLower) {
        case 'checkup': return '👨‍⚕️';
        case 'vaccination': return '💉';
        case 'surgery': return '🔪';
        case 'dental': return '🦷';
        case 'grooming': return '✂️';
        default: return '📋';
    }
};

const MedicalRecordsPage = () => {
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      const res = await getMedicalRecords(token);
      setRecords(res);
    } catch (error) {
      toast.error('Error fetching medical records');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record: MedicalRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      await deleteMedicalRecord(recordToDelete.id, token);
      toast.success('Medical record deleted successfully');
      setRecords(records.filter(record => record.id !== recordToDelete.id));
    } catch (error) {
      toast.error('Error deleting medical record');
      console.error('Error:', error);
    } finally {
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleView = (record: MedicalRecord) => {
    router.push(`/profile/medical-records/${record.id}`);
  };

  const handleSave = async (recordData: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      if (selectedRecord) {
        await updateMedicalRecord(selectedRecord.id, recordData, token);
        toast.success('Medical record updated successfully');
      } else {
        await createMedicalRecord(recordData, token);
        toast.success('Medical record created successfully');
      }

      setIsModalOpen(false);
      setSelectedRecord(null);
      fetchRecords();
    } catch (error) {
      toast.error('Error saving medical record');
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-black">Medical Records</h2>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 h-10 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Add New Record
          </Button>
        </div>

        {records.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">No medical records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veterinarian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.petName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="h-10 w-10 rounded-full flex items-center justify-center bg-[#FFE9D2] text-2xl">
                          {getProcedureEmoji(record.procedureType)}
                        </span>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.procedureType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.veterinarianName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleView(record)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View record"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Edit record"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MedicalRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        record={selectedRecord}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Medical Record</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this medical record? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalRecordsPage; 