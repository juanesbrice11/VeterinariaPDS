const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getMedicalRecords = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/medical-records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error fetching medical records');
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createMedicalRecord = async (record: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/medical-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Error creating medical record');
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const updateMedicalRecord = async (id: number, record: any, token: string) => {
  try {
    const response = await fetch(`${API_URL}/medical-records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Error updating medical record');
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteMedicalRecord = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/medical-records/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error deleting medical record');
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getMedicalRecordById = async (id: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/medical-records/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error fetching medical record');
    return response.json();
  } catch (error) {
    throw error;
  }
}; 