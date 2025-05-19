import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Pet } from '../models/pet';
import { AuthenticatedRequest } from '../middlewares/authenticateToken';

// Crear nueva mascota
export const createPet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, species, breed, color, birthDate, gender, weight } = req.body;

        if (!name || !species) {
            res.status(400).json({ message: 'Nombre y especie son requeridos' });
            return;
        }

        const petRepo = AppDataSource.getRepository(Pet);
        const newPet = petRepo.create({
            name,
            species,
            breed,
            color,
            birthDate,
            gender,
            weight,
            ownerId: req.user?.id
        });

        await petRepo.save(newPet);
        res.status(201).json({ message: 'Mascota registrada', pet: newPet });
    } catch (error) {
        console.error('Error en createPet:', error);
        res.status(500).json({ message: 'Error al registrar la mascota' });
    }
};

export const createPetSecretary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, species, breed, color, birthDate, gender, weight, ownerId } = req.body;

        if (!name || !species) {
            res.status(400).json({ message: 'Nombre y especie son requeridos' });
            return;
        }

        const petRepo = AppDataSource.getRepository(Pet);
        const newPet = petRepo.create({
            name,
            species,
            breed,
            color,
            birthDate,
            gender,
            weight,
            ownerId
        });

        await petRepo.save(newPet);
        res.status(201).json({ message: 'Mascota registrada', pet: newPet });
    } catch (error) {
        console.error('Error en createPet:', error);
        res.status(500).json({ message: 'Error al registrar la mascota' });
    }
};

// Obtener todas las mascotas del usuario autenticado
export const getMyPets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const petRepo = AppDataSource.getRepository(Pet);
        const pets = await petRepo.find({ where: { ownerId: req.user?.id } });
        res.status(200).json(pets);
    } catch (error) {
        console.error('Error en getMyPets:', error);
        res.status(500).json({ message: 'Error al obtener las mascotas' });
    }
};

// Obtener mascota por ID (validando que sea del usuario)
export const getPetById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const petRepo = AppDataSource.getRepository(Pet);
        const pet = await petRepo.findOne({ where: { id: parseInt(id), ownerId: req.user?.id } });

        if (!pet) {
            res.status(404).json({ message: 'Mascota no encontrada' });
            return;
        }

        res.status(200).json(pet);
    } catch (error) {
        console.error('Error en getPetById:', error);
        res.status(500).json({ message: 'Error al obtener la mascota usuario id' });
    }
};

export const getPetByIdSecretary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const petRepo = AppDataSource.getRepository(Pet);
        const pet = await petRepo.findOne({ where: { id: parseInt(id)} });

        if (!pet) {
            res.status(404).json({ message: 'Mascota no encontrada' });
            return;
        }

        res.status(200).json(pet);
    } catch (error) {
        console.error('Error en getPetById:', error);
        res.status(500).json({ message: 'Error al obtener la mascota secretaria' });
    }
};

// Actualizar mascota
export const updatePet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const petRepo = AppDataSource.getRepository(Pet);
        const pet = await petRepo.findOne({ where: { id: parseInt(id), ownerId: req.user?.id } });

        if (!pet) {
            res.status(404).json({ message: 'Mascota no encontrada' });
            return;
        }

        Object.assign(pet, req.body);
        await petRepo.save(pet);
        res.status(200).json({ message: 'Mascota actualizada', pet });
    } catch (error) {
        console.error('Error en updatePet:', error);
        res.status(500).json({ message: 'Error al actualizar la mascota' });
    }
};

// Eliminar mascota
export const deletePet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const petRepo = AppDataSource.getRepository(Pet);
        const result = await petRepo.delete({ id: parseInt(id), ownerId: req.user?.id });

        if (result.affected === 0) {
            res.status(404).json({ message: 'Mascota no encontrada o no pertenece al usuario' });
            return;
        }

        res.status(200).json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
        console.error('Error en deletePet:', error);
        res.status(500).json({ message: 'Error al eliminar la mascota' });
    }
};

// Obtener todas las mascotas
export const getAllPets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const petRepo = AppDataSource.getRepository(Pet);
        
        // Primero intentamos obtener las mascotas sin relaciones
        const pets = await petRepo.find({
            relations: {
                owner: true
            }
        });
        
        // Transformamos los datos para asegurar el formato correcto
        const formattedPets = pets.map(pet => ({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            color: pet.color,
            birthDate: pet.birthDate,
            gender: pet.gender,
            weight: pet.weight,
            createdAt: pet.createdAt,
            updatedAt: pet.updatedAt,
            owner: pet.owner ? {
                id: pet.owner.id,
                name: pet.owner.name,
                email: pet.owner.email,
                phone: pet.owner.phone
            } : null
        }));

        res.status(200).json({
            success: true,
            pets: formattedPets
        });
    } catch (error) {
        console.error('Error detallado en getAllPets:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener las mascotas',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Función para obtener todas las mascotas (con autenticación y roles)
export const getAllPetsV2 = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Verificar que el usuario tenga el rol correcto
        if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Secretary')) {
            res.status(403).json({
                success: false,
                message: 'No tienes permiso para acceder a esta información'
            });
            return;
        }

        const petRepo = AppDataSource.getRepository(Pet);
        
        // Obtener todas las mascotas con la relación owner
        const pets = await petRepo
            .createQueryBuilder("pet")
            .leftJoinAndSelect("pet.owner", "owner")
            .getMany();


        // Formatear la respuesta
        const formattedPets = pets.map(pet => ({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed || '',
            color: pet.color || '',
            birthDate: pet.birthDate,
            gender: pet.gender,
            weight: pet.weight,
            createdAt: pet.createdAt,
            updatedAt: pet.updatedAt,
            owner: pet.owner ? {
                id: pet.owner.id,
                name: pet.owner.name,
                email: pet.owner.email,
                phone: pet.owner.phone
            } : null
        }));

        res.status(200).json({
            success: true,
            pets: formattedPets
        });
    } catch (error) {
        console.error('Error en getAllPetsV2:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener las mascotas',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
