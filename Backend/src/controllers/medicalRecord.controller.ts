import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { MedicalRecord } from '../models/medicalRecord';
import { Pet } from '../models/pet';
import { AuthenticatedRequest } from '../middlewares/authenticateToken';

// Crear un registro médico (solo veterinario)
export const createMedicalRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { petId, date, description, procedureType } = req.body;

        if (!petId || !date || !description || !procedureType) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }

        if (req.user?.role !== 'Veterinario') {
            res.status(403).json({ message: 'Solo los veterinarios pueden crear registros médicos' });
            return;
        }

        const pet = await AppDataSource.getRepository(Pet).findOne({ where: { id: petId } });
        if (!pet) {
            res.status(404).json({ message: 'Mascota no encontrada' });
            return;
        }

        const medicalRecordRepo = AppDataSource.getRepository(MedicalRecord);
        const record = medicalRecordRepo.create({
            petId,
            date,
            description,
            procedureType,
            veterinarianId: req.user.id,
        });

        await medicalRecordRepo.save(record);
        res.status(201).json({ message: 'Registro médico creado exitosamente', record });
    } catch (error) {
        console.error('Error al crear registro médico:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Obtener registros médicos de una mascota (veterinario o dueño)
export const getMedicalRecordsByPet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { petId } = req.params;
        const pet = await AppDataSource.getRepository(Pet).findOne({ where: { id: parseInt(petId) } });
        if (!pet) {
            res.status(404).json({ message: 'Mascota no encontrada' });
            return;
        }
        const isOwner = pet.ownerId === req.user?.id;
        const isVet = req.user?.role === 'Veterinario';
        if (!isOwner && !isVet) {
            res.status(403).json({ message: 'No tienes permiso para ver el historial de esta mascota' });
            return;
        }
        const medicalRecordRepo = AppDataSource.getRepository(MedicalRecord);
        const records = await medicalRecordRepo.find({ where: { petId: pet.id } });

        res.status(200).json(records);
    } catch (error) {
        console.error('Error al obtener historial médico:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};