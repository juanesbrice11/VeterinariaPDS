import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, documentType, documentNumber } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Todos los campos son requeridos" });
            return;
        }

        const emailLowerCase = email.toLowerCase();
        const userRepository = AppDataSource.getRepository(User);

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

        res.status(201).json({ message: "Usuario registrado exitosamente", user: { id: newUser.id, name, email } });
    } catch (error) {
        console.error("Error en signUp:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Correo y contraseña son requeridos" });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "Credenciales incorrectas" });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "30m" });

        res.status(200).json({ message: "Inicio de sesión exitoso", token, user: { id: user.id, name: user.name, email } });
    } catch (error) {
        console.error("Error en signIn:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
