import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Appointment } from '../models/appointment';
import { Pet } from '../models/pet';
import { Service } from '../models/Service';
import { AuthenticatedRequest } from '../middlewares/authenticateToken';
import { User } from '../models/User';
import { Between, Not } from 'typeorm';

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

        const appointmentDateTime = new Date(appointmentDate);
        if (isNaN(appointmentDateTime.getTime())) {
            res.status(400).json({ message: 'Fecha inválida' });
            return;
        }

        if (appointmentDateTime < new Date()) {
            res.status(400).json({ message: 'No se pueden agendar citas en el pasado' });
            return;
        }

        const hour = appointmentDateTime.getHours();
        if (hour < 8 || hour >= 17) {
            res.status(400).json({ 
                message: 'El horario debe estar entre las 8:00 AM y las 5:00 PM',
                receivedHour: hour
            });
            return;
        }

        if (appointmentDateTime.getMinutes() !== 0) {
            res.status(400).json({ message: 'Las citas solo se pueden agendar en punto (ej: 8:00, 9:00, etc.)' });
            return;
        }

        const existingAppointment = await appointmentRepo.findOne({
            where: {
                appointmentDate: appointmentDateTime,
                status: Not('Cancelled')
            }
        });

        if (existingAppointment) {
            res.status(400).json({ message: 'Ya existe una cita agendada para este horario' });
            return;
        }

        const appointment = appointmentRepo.create({
            petId,
            serviceId,
            userId: req.user.id,
            appointmentDate: appointmentDateTime,
            status: 'Pending',
        });

        await appointmentRepo.save(appointment);
        res.status(201).json({ message: 'Cita agendada exitosamente', appointment });
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({ message: 'Error al agendar la cita' });
    }
};

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

export const getMyDetailedAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        
        const appointments = await appointmentRepository.find({
            where: { userId: req.user?.id },
            relations: {
                pet: true,
                service: true,
                veterinarian: true
            },
            select: {
                id: true,
                appointmentDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                pet: {
                    id: true,
                    name: true,
                    species: true,
                    breed: true
                },
                service: {
                    id: true,
                    title: true,
                    description: true
                },
                veterinarian: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            order: {
                appointmentDate: 'DESC'
            }
        });

        res.status(200).json({
            message: "Appointments retrieved successfully",
            data: appointments
        });
    } catch (error) {
        console.error("Error in getMyDetailedAppointments:", error);
        res.status(500).json({
            message: "Error retrieving appointments"
        });
    }
};

export const getAvailableTimeSlots = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.query;

        if (!date) {
            res.status(400).json({
                message: "La fecha es requerida (formato: YYYY-MM-DD)"
            });
            return;
        }

        const appointmentRepository = AppDataSource.getRepository(Appointment);
        const dateStart = new Date(`${date}T00:00:00.000Z`);
        const dateEnd = new Date(`${date}T23:59:59.999Z`);

        const bookedAppointments = await appointmentRepository.find({
            where: {
                appointmentDate: Between(dateStart, dateEnd),
                status: Not('Cancelled')
            }
        });

        const bookedHours = new Set(
            bookedAppointments.map(app => {
                const appDate = new Date(app.appointmentDate);
                return appDate.getHours();
            })
        );

        const availableTimeSlots = Array.from({ length: 9 }, (_, i) => i + 8)
            .filter(hour => !bookedHours.has(hour))
            .map(hour => `${hour.toString().padStart(2, '0')}:00`);

        res.status(200).json({
            message: "Available time slots retrieved successfully",
            data: {
                date: date,
                availableTimeSlots: availableTimeSlots
            }
        });
    } catch (error) {
        console.error("Error in getAvailableTimeSlots:", error);
        res.status(500).json({
            message: "Error retrieving available time slots"
        });
    }
};

export const getAllAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        
        const appointments = await appointmentRepository.find({
            relations: {
                pet: true,
                service: true,
                veterinarian: true,
                user: true
            },
            select: {
                id: true,
                appointmentDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                pet: {
                    id: true,
                    name: true,
                    species: true,
                    breed: true
                },
                service: {
                    id: true,
                    title: true,
                    description: true
                },
                veterinarian: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                },
                user: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            order: {
                appointmentDate: 'DESC'
            }
        });

        res.status(200).json({
            message: "All appointments retrieved successfully",
            data: appointments
        });
    } catch (error) {
        console.error("Error in getAllAppointments:", error);
        res.status(500).json({
            message: "Error retrieving appointments"
        });
    }
};

export const getAppointmentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        
        const appointment = await appointmentRepository.findOne({
            where: { id: parseInt(id) },
            relations: {
                pet: true,
                service: true,
                veterinarian: true,
                user: true
            },
            select: {
                id: true,
                appointmentDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                pet: {
                    id: true,
                    name: true,
                    species: true,
                    breed: true
                },
                service: {
                    id: true,
                    title: true,
                    description: true
                },
                veterinarian: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                },
                user: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            }
        });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.status(200).json({
            message: "Appointment retrieved successfully",
            data: appointment
        });
    } catch (error) {
        console.error("Error in getAppointmentById:", error);
        res.status(500).json({
            message: "Error retrieving appointment"
        });
    }
};

export const updateAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { petId, serviceId, appointmentDate, status, veterinarianId } = req.body;
        
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        const appointment = await appointmentRepository.findOne({ 
            where: { id: parseInt(id) }
        });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        if (petId) {
            const petRepo = AppDataSource.getRepository(Pet);
            const pet = await petRepo.findOne({ where: { id: petId } });
            if (!pet) {
                res.status(404).json({ message: "Pet not found" });
                return;
            }
            appointment.petId = petId;
        }

        if (serviceId) {
            const serviceRepo = AppDataSource.getRepository(Service);
            const service = await serviceRepo.findOne({ where: { id: serviceId } });
            if (!service) {
                res.status(404).json({ message: "Service not found" });
                return;
            }
            appointment.serviceId = serviceId;
        }

        if (appointmentDate) {
            const appointmentDateTime = new Date(appointmentDate);
            if (isNaN(appointmentDateTime.getTime())) {
                res.status(400).json({ message: "Invalid date format" });
                return;
            }
            appointment.appointmentDate = appointmentDateTime;
        }

        if (status) {
            if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
                res.status(400).json({ message: "Invalid status" });
                return;
            }
            appointment.status = status;
        }

        if (veterinarianId) {
            const userRepo = AppDataSource.getRepository(User);
            const veterinarian = await userRepo.findOne({ 
                where: { id: veterinarianId, role: 'Veterinario' }
            });
            if (!veterinarian) {
                res.status(404).json({ message: "Veterinarian not found" });
                return;
            }
            appointment.veterinarianId = veterinarianId;
        }

        await appointmentRepository.save(appointment);

        res.status(200).json({
            message: "Appointment updated successfully",
            data: appointment
        });
    } catch (error) {
        console.error("Error in updateAppointment:", error);
        res.status(500).json({
            message: "Error updating appointment"
        });
    }
};

export const deleteAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        
        const appointment = await appointmentRepository.findOne({ 
            where: { id: parseInt(id) }
        });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        await appointmentRepository.remove(appointment);

        res.status(200).json({
            message: "Appointment deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteAppointment:", error);
        res.status(500).json({
            message: "Error deleting appointment"
        });
    }
};