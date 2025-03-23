import { Request, Response, NextFunction } from "express";

export const validateSignUp = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, password, documentNumber } = req.body;

    if (!name || !email || !password || !documentNumber) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Correo electrónico inválido" });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        return;
    }

    next(); 
};
