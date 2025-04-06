import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token no proporcionado" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, role: string };
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        res.status(403).json({ message: "Token inválido o expirado" });
    }
};

export default authenticateToken;
