import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
    return;
    }
    next();
    };
};