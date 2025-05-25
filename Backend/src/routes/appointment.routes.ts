import { Router } from 'express';
import {
    createAppointment,
    getMyAppointments,
    cancelAppointment,
    updateAppointmentStatus,
    getMyDetailedAppointments,
    getAvailableTimeSlots,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate
} from '../controllers/appointment.controller';
import authenticateToken from '../middlewares/authenticateToken';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const router = Router();

// Client routes
router.post('/', authenticateToken, authorizeRoles('Client', 'Guest', 'Admin'), createAppointment);
router.get('/', authenticateToken, getMyAppointments);
router.get('/detailed', authenticateToken, getMyDetailedAppointments);
router.get('/available-slots', getAvailableTimeSlots);
router.patch('/:id/cancel', authenticateToken, authorizeRoles('Client', 'Guest', 'Admin'), cancelAppointment);
router.patch('/:id/status', authenticateToken, authorizeRoles('Veterinario'), updateAppointmentStatus);

// Admin routes
router.get('/admin/all', authenticateToken, authorizeRoles('Admin'), getAllAppointments);
router.get('/admin/filtered', authenticateToken, authorizeRoles('Admin'), getAppointmentsByDate);
router.get('/admin/:id', authenticateToken, authorizeRoles('Admin'), getAppointmentById);
router.put('/admin/:id', authenticateToken, authorizeRoles('Admin'), updateAppointment);
router.delete('/admin/:id', authenticateToken, authorizeRoles('Admin'), deleteAppointment);

export default router;