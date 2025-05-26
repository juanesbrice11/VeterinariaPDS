import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { MedicalRecord } from '../models/medicalRecord';
import { Pet } from '../models/pet';
import { AuthenticatedRequest } from '../middlewares/authenticateToken';

// Obtener todos los registros médicos (veterinario o admin)
export const getAllMedicalRecords = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'Veterinario' && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'No tienes permiso para ver los registros médicos' });
            return;
        }

        const medicalRecordRepo = AppDataSource.getRepository(MedicalRecord);
        const records = await medicalRecordRepo.find({
            relations: ['pet', 'veterinarian'],
            order: {
                date: 'DESC'
            }
        });

        const formattedRecords = records.map(record => ({
            id: record.id,
            petId: record.petId,
            petName: record.pet.name,
            date: record.date,
            description: record.description,
            procedureType: record.procedureType,
            veterinarianId: record.veterinarianId,
            veterinarianName: `${record.veterinarian.name}`
        }));

        res.status(200).json(formattedRecords);
    } catch (error) {
        console.error('Error al obtener registros médicos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Crear un registro médico (veterinario o admin)
export const createMedicalRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { petId, date, description, procedureType } = req.body;

        if (!petId || !date || !description || !procedureType) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }

        if (req.user?.role !== 'Veterinario' && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'Solo los veterinarios y administradores pueden crear registros médicos' });
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

// Obtener registros médicos de una mascota (veterinario, admin o dueño)
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
        const isAdmin = req.user?.role === 'Admin';
        if (!isOwner && !isVet && !isAdmin) {
            res.status(403).json({ message: 'No tienes permiso para ver el historial de esta mascota' });
            return;
        }
        const medicalRecordRepo = AppDataSource.getRepository(MedicalRecord);
        const records = await medicalRecordRepo.find({ 
            where: { petId: pet.id },
            relations: ['pet', 'veterinarian']
        });

        const formattedRecords = records.map(record => ({
            id: record.id,
            petId: record.petId,
            petName: record.pet.name,
            date: record.date,
            description: record.description,
            procedureType: record.procedureType,
            veterinarianId: record.veterinarianId,
            veterinarianName: `${record.veterinarian.name}`
        }));

        res.status(200).json(formattedRecords);
    } catch (error) {
        console.error('Error al obtener historial médico:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar un registro médico (veterinario o admin)
export const updateMedicalRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { date, description, procedureType } = req.body;

        if (req.user?.role !== 'Veterinario' && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'Solo los veterinarios y administradores pueden actualizar registros médicos' });
            return;
        }

        const medicalRecordRepo = AppDataSource.getRepository(MedicalRecord);
        const record = await medicalRecordRepo.findOne({ where: { id: parseInt(id) } });

        if (!record) {
            res.status(404).json({ message: 'Registro médico no encontrado' });
            return;
        }

        record.date = date || record.date;
        record.description = description || record.description;
        record.procedureType = procedureType || record.procedureType;

        await medicalRecordRepo.save(record);
        res.status(200).json({ message: 'Registro médico actualizado exitosamente', record });
    } catch (error) {
        console.error('Error al actualizar registro médico:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Eliminar un registro médico (veterinario o admin)
export const deleteMedicalRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (req.user?.role !== 'Veterinario' && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'Solo los veterinarios y administradores pueden eliminar registros médicos' });
            return;
        }

        const medicalRecordRepo = AppDataSource.getRepository(MedicalRecord);
        const record = await medicalRecordRepo.findOne({ where: { id: parseInt(id) } });

        if (!record) {
            res.status(404).json({ message: 'Registro médico no encontrado' });
            return;
        }

        await medicalRecordRepo.remove(record);
        res.status(200).json({ message: 'Registro médico eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar registro médico:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};