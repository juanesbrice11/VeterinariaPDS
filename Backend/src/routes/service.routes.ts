import { Router } from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deactivateService,
} from '../controllers/service.controller';

const router = Router();

router.post('/', createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deactivateService);

export default router;
