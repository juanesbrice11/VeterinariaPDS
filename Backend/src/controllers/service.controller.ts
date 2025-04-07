import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Service } from '../models/Service';

export const createService = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
        res.status(400).json({ message: 'Título y descripción son requeridos' });
        return;
        }

        const serviceRepo = AppDataSource.getRepository(Service);
        const newService = serviceRepo.create({ title, description });

        await serviceRepo.save(newService);
        res.status(201).json({ message: 'Servicio creado exitosamente', service: newService });
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
    try {
        const serviceRepo = AppDataSource.getRepository(Service);
        const services = await serviceRepo.find();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const serviceRepo = AppDataSource.getRepository(Service);
        const service = await serviceRepo.findOne({ where: { id: parseInt(id) } });

        if (!service) {
        res.status(404).json({ message: 'Servicio no encontrado' });
        return;
        }

        res.status(200).json(service);
    } catch (error) {
        console.error('Error al obtener servicio por ID:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, isActive } = req.body;

        const serviceRepo = AppDataSource.getRepository(Service);
        const service = await serviceRepo.findOne({ where: { id: parseInt(id) } });

        if (!service) {
        res.status(404).json({ message: 'Servicio no encontrado' });
        return;
        }

        service.title = title ?? service.title;
        service.description = description ?? service.description;
        service.isActive = isActive ?? service.isActive;

        await serviceRepo.save(service);
        res.status(200).json({ message: 'Servicio actualizado', service });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deactivateService = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const serviceRepo = AppDataSource.getRepository(Service);
        const service = await serviceRepo.findOne({ where: { id: parseInt(id) } });

        if (!service) {
        res.status(404).json({ message: 'Servicio no encontrado' });
        return;
        }

        service.isActive = false;
        await serviceRepo.save(service);

        res.status(200).json({ message: 'Servicio desactivado' });
    } catch (error) {
        console.error('Error al desactivar servicio:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
