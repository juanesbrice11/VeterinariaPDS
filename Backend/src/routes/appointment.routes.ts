import { Router } from 'express';
import {
createAppointment,
getMyAppointments,
cancelAppointment,
updateAppointmentStatus
} from '../controllers/appointment.controller';
import authenticateToken from '../middlewares/authenticateToken';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const router = Router();

router.post('/', authenticateToken, authorizeRoles('Client', 'Guest'), createAppointment);
router.get('/', authenticateToken, getMyAppointments);
router.patch('/:id/cancel', authenticateToken, authorizeRoles('Client', 'Guest'), cancelAppointment);
router.patch('/:id/status', authenticateToken, authorizeRoles('Veterinario'), updateAppointmentStatus);

export default router;