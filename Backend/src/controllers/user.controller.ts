import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../config/ormconfig";
import { AuthenticatedRequest } from "../middlewares/authenticateToken";
import * as bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
            select: ["id", "name", "email", "documentType", "documentNumber", "status", "role"]
        });
        res.json(users);
    } catch (error) {
        console.error("Error en getUsers:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const editProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user?.id } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { name, email, phone, birthDate, gender, address, bio, role } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (birthDate) user.birthDate = birthDate;
        if (gender) user.gender = gender;
        if (role) user.role = role;
        if (address) user.address = address;
        if (bio) user.bio = bio;

        await userRepository.save(user);

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error en editProfile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export const getMyProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: req.user?.id },
            select: [
                "id",
                "name",
                "email",
                "phone",
                "birthDate",
                "gender",
                "address",
                "bio",
                "status",
                "role",
                "createdAt",
                "updatedAt"
            ]
        });

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error en getMyProfile:", error);
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
};



export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Debes proporcionar la contraseña actual y la nueva" });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user?.id } });

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "La contraseña actual es incorrecta" });
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await userRepository.save(user);

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error("Error en changePassword:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña" });
    }
};

const VALID_ROLES = ['Guest', 'Client', 'Veterinario', 'Admin'];

export const updateUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const documentNumber = req.params.documentNumber;
        const { name, email, phone, birthDate, gender, address, bio, role } = req.body;

        // Validar que venga role y sea válido
        if (!role || !VALID_ROLES.includes(role)) {
            res.status(400).json({ message: `Role inválido. Debe ser uno de: ${VALID_ROLES.join(', ')}` });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ documentNumber });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (birthDate) user.birthDate = birthDate;
        if (gender) user.gender = gender;
        if (role) user.role = role;
        if (address) user.address = address;
        if (bio) user.bio = bio;

        user.role = role;
        await userRepo.save(user);

        res.status(200).json({ message: 'Rol actualizado correctamente', user: { id: user.id, role: user.role } });
    } catch (error) {
        console.error('Error en updateUserRole:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

