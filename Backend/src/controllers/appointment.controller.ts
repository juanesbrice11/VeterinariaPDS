import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Appointment } from '../models/appointment';
import { Pet } from '../models/pet';
import { Service } from '../models/Service';
import { AuthenticatedRequest } from '../middlewares/authenticateToken';
import { User } from '../models/User';

// Crear cita (solo clientes)
export const createAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { petId, serviceId, appointmentDate } = req.body;


        if (!petId || !serviceId || !appointmentDate) {
            res.status(400).json({ message: 'Pet, servicio y fecha son requeridos' });
            return;
        }

        const petRepo = AppDataSource.getRepository(Pet);
        const serviceRepo = AppDataSource.getRepository(Service);
        const appointmentRepo = AppDataSource.getRepository(Appointment);

        const pet = await petRepo.findOne({ where: { id: petId } });
        const service = await serviceRepo.findOne({ where: { id: serviceId } });

        if (!pet || pet.ownerId !== req.user?.id) {
            res.status(404).json({ message: 'Mascota no válida o no pertenece al usuario' });
            return;
        }

        if (!service) {
            res.status(404).json({ message: 'Servicio no encontrado' });
            return;
        }

        const appointment = appointmentRepo.create({
            petId,
            serviceId,
            userId: req.user.id,
            appointmentDate: new Date(appointmentDate),
            status: 'Pending',
        });

        await appointmentRepo.save(appointment);
        res.status(201).json({ message: 'Cita agendada exitosamente', appointment });
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({ message: 'Error al agendar la cita' });
    }
};

// Obtener citas del usuario autenticado (cliente o veterinario)
export const getMyAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const repo = AppDataSource.getRepository(Appointment);
        let appointments = [];

        if (req.user.role === 'Veterinario') {
            appointments = await repo.find({ where: { veterinarianId: req.user.id } });
        } else {
            appointments = await repo.find({ where: { userId: req.user.id } });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ message: 'Error al obtener las citas' });
    }
};

        // Cancelar cita (cliente)
export const cancelAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Appointment);

        const appointment = await repo.findOne({ where: { id: parseInt(id), userId: req.user?.id } });

        if (!appointment) {
            res.status(404).json({ message: 'Cita no encontrada o no autorizada' });
            return;
        }

        if (appointment.status === 'Cancelled' || appointment.status === 'Completed') {
            res.status(400).json({ message: 'La cita no puede ser cancelada' });
            return;
        }

        appointment.status = 'Cancelled';
        await repo.save(appointment);

        res.status(200).json({ message: 'Cita cancelada exitosamente', appointment });
    } catch (error) {
        console.error('Error al cancelar cita:', error);
        res.status(500).json({ message: 'Error al cancelar la cita' });
    }
};

// Confirmar o completar cita (veterinario)
export const updateAppointmentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Confirmed', 'Completed'].includes(status)) {
            res.status(400).json({ message: 'Estado inválido' });
            return;
        }

        const repo = AppDataSource.getRepository(Appointment);
        const appointment = await repo.findOne({ where: { id: parseInt(id), veterinarianId: req.user?.id } });

        if (!appointment) {
            res.status(404).json({ message: 'Cita no encontrada o no autorizada' });
            return;
        }

        appointment.status = status;
        await repo.save(appointment);

        res.status(200).json({ message: 'Estado actualizado', appointment });
    } catch (error) {
        console.error('Error al actualizar estado de cita:', error);
        res.status(500).json({ message: 'Error al actualizar la cita' });
    }
};