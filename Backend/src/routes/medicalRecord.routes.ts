import { Router } from 'express';
import authenticateToken from '../middlewares/authenticateToken';
import {
    createMedicalRecord,
    getMedicalRecordsByPet,
    getAllMedicalRecords,
    updateMedicalRecord,
    deleteMedicalRecord
} from '../controllers/medicalRecord.controller';

const router = Router();

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Obtener todos los registros médicos (con paginación)
router.get('/', getAllMedicalRecords);

// Obtener registros médicos de una mascota específica
router.get('/pet/:petId', getMedicalRecordsByPet);

// Crear un nuevo registro médico
router.post('/', createMedicalRecord);

// Actualizar un registro médico
router.put('/:id', updateMedicalRecord);

// Eliminar un registro médico
router.delete('/:id', deleteMedicalRecord);

export default router;