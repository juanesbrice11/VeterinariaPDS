import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Formato de correo inválido" });
        }

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está en uso" });
        }

        const user = userRepository.create({ name, email, password });
        await userRepository.save(user);
        return res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "30m" });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error });
    }
};
