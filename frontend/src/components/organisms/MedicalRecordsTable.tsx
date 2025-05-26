"use client";

import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import MedicalRecordModal from '@/components/molecules/MedicalRecordModal';
import { 
  getMedicalRecords, 
  createMedicalRecord, 
  updateMedicalRecord, 
  deleteMedicalRecord 
} from '@/services/MedicalRecordServices';

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

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

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
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro médico?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }
        await deleteMedicalRecord(id, token);
        toast.success('Registro médico eliminado correctamente');
        fetchRecords();
      } catch (error) {
        toast.error('Error al eliminar el registro médico');
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleView = (record: MedicalRecord) => {
    // TODO: Implement view medical record details
    console.log('View record:', record);
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
        toast.success('Registro médico actualizado correctamente');
      } else {
        await createMedicalRecord(recordData, token);
        toast.success('Registro médico creado correctamente');
      }

      setIsModalOpen(false);
      setSelectedRecord(null);
      fetchRecords();
    } catch (error) {
      toast.error('Error al guardar el registro médico');
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historiales Médicos</h1>
        <button
          onClick={() => {
            setSelectedRecord(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Agregar Registro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Procedimiento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veterinario
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.petName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.procedureType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.veterinarianName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleView(record)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition duration-200"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md transition duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition duration-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
};

export default MedicalRecordsPage; 