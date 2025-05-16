import { Request, Response } from 'express';
import { generateNotifications } from '../services/notification.service';
import { AppDataSource } from '../config/ormconfig';
import { Notification } from '../models/notifications';
import { AuthenticatedRequest } from '../middlewares/authenticateToken';

export const getMyNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const repo = AppDataSource.getRepository(Notification);
        const [notifications, total] = await repo.findAndCount({
            where: { userId: req.user.id },
            order: { sentAt: 'DESC' },
            skip,
            take: limit
        });

        res.status(200).json({
        data: notifications,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const repo = AppDataSource.getRepository(Notification);
        const notification = await repo.findOne({ where: { id: parseInt(id), userId: req.user.id } });

        if (!notification) {
            res.status(404).json({ message: 'Notificación no encontrada' });
            return;
        }

        notification.isRead = true;
        await repo.save(notification);

        res.status(200).json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        console.error('Error al marcar como leída:', error);
        res.status(500).json({ message: 'Error al actualizar notificación' });
    }
};

export const runNotificationJob = async (_req: Request, res: Response): Promise<void> => {
    try {
        await generateNotifications();
        res.status(200).json({ message: 'Notificaciones generadas correctamente.' });
    } catch (error) {
        console.error('Error al ejecutar el job de notificaciones:', error);
        res.status(500).json({ message: 'Error al generar notificaciones' });
    }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
        res.status(401).json({ message: 'No autorizado' });
        return;
        }

        const repo = AppDataSource.getRepository(Notification);
        await repo.update({ userId: req.user.id, isRead: false }, { isRead: true });

        res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar todas como leídas:', error);
        res.status(500).json({ message: 'Error al actualizar notificaciones' });
    }
};
