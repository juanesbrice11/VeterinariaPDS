import { Router } from 'express';
import {
    runNotificationJob,
    getMyNotifications,
    markAsRead,
    markAllAsRead
} from '../controllers/notifications.controller';
import authenticateToken from '../middlewares/authenticateToken';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const router = Router();

router.get('/run', authenticateToken, authorizeRoles('Admin'), runNotificationJob);
router.get('/', authenticateToken, getMyNotifications);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);


export default router;