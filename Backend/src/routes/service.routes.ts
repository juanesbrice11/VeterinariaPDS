import { Router } from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deactivateService,
} from '../controllers/service.controller';
import authenticateToken from '../middlewares/authenticateToken';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', authenticateToken, authorizeRoles('Admin'), createService);
router.put('/:id', authenticateToken, authorizeRoles('Admin'), updateService);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deactivateService);

export default router;
