import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import serviceRoutes from './service.routes';


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use('/services', serviceRoutes);

export default router;
