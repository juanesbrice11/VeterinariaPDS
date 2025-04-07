import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { AuthenticatedRequest } from "../middlewares/authenticateToken";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name, email, password, documentType, documentNumber,
            phone, birthDate, gender, address, bio
        } = req.body;

        if (!name || !email || !password || !documentNumber) {
            res.status(400).json({ message: "Todos los campos requeridos no fueron proporcionados" });
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
        const verificationToken = uuidv4();

        const newUser = userRepository.create({
            name,
            email: emailLowerCase,
            password: hashedPassword,
            documentType: documentType || "CC",
            documentNumber,
            phone: phone || null,
            birthDate: birthDate || null,
            gender: gender || null,
            address: address || null,
            bio: bio || null,
            verificationToken,
            isVerified: false,
            status: "Active",
            role: "Guest",
        });

        await userRepository.save(newUser);

        res.status(201).json({
            message: "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
            user: { id: newUser.id, name, email: newUser.email }
        });
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
        const user = await userRepository.findOne({ where: { email: email.toLowerCase() } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "Credenciales incorrectas" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "30m" }
        );

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error en signIn:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email: email.toLowerCase() } });

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 60); 

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpires = expires;

        await userRepository.save(user);

        const resetLink = `http://localhost:3001/reset?token=${token}`;
        const html = `
            <p>Hola ${user.name},</p>
            <p>Solicitaste un cambio de contraseña.</p>
            <p>Haz clic aquí para cambiarla:</p>
            <a href="${resetLink}">${resetLink}</a>
        `;

        await sendEmail(user.email, "Reestablecer contraseña", html);

        res.status(200).json({ message: "Se ha enviado un enlace para reestablecer tu contraseña" });
    } catch (error) {
        console.error("Error en requestPasswordReset:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { resetPasswordToken: token } });

        if (!user || !user.resetPasswordTokenExpires || user.resetPasswordTokenExpires < new Date()) {
            res.status(400).json({ message: "Token inválido o expirado" });
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null as any;
        user.resetPasswordTokenExpires = null as any;

        await userRepository.save(user);

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ message: "Error al reestablecer la contraseña" });
    }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user?.id } });

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        user.lastLogin = null as any;
        await userRepository.save(user);

        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        console.error("Error en logout:", error);
        res.status(500).json({ message: "Error al cerrar sesión" });
    }
};

export const testEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { to } = req.body;

        const html = `
            <h2>Correo de prueba</h2>
            <p>¡Hola! Este es un correo de prueba desde la veterinaria 🐾</p>
        `;

        await sendEmail(to, "Correo de prueba", html);

        res.status(200).json({ message: "Correo enviado correctamente" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error al enviar el correo" });
    }
};