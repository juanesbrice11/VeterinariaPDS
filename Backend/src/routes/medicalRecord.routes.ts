import { Router } from 'express';
import { createMedicalRecord, getMedicalRecordsByPet } from '../controllers/medicalRecord.controller';
import authenticateToken from '../middlewares/authenticateToken';

const router = Router();

router.post('/', authenticateToken, createMedicalRecord);
router.get('/pet/:petId', authenticateToken, getMedicalRecordsByPet);

export default router;