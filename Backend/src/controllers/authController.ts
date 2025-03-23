import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const signUp = async (req: Request, res: Response): Promise<void> => { 
    try {
        const { name, email, password, documentType, documentNumber } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Todos los campos son requeridos" });
            return;
        }

        const emailLowerCase = email.toLowerCase();
        const existingUser = await userRepository.findOne({ where: { email: emailLowerCase } });
        if (existingUser) {
            res.status(400).json({ message: "El correo ya está registrado" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({ 
            name,
            email: emailLowerCase,
            password: hashedPassword,
            documentType: documentType || "CC",
            documentNumber,
            status: "Active",
            role: "Guest"
        });

        await userRepository.save(newUser);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "Credenciales incorrectas" });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "30m" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};
