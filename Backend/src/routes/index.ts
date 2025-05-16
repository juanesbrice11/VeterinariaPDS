import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import serviceRoutes from './service.routes';
import productRoutes from './product.routes'
import petRoutes from './pet.routes';
import medicalRecordRoutes from './medicalRecord.routes';
import appointmentRoutes from './appointment.routes';
import notificationRoutes from './notifications.routes';

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use('/services', serviceRoutes);
router.use('/products', productRoutes);
router.use('/pets', petRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/notifications', notificationRoutes);

export default router;
