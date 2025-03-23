import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../config/ormconfig";

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

