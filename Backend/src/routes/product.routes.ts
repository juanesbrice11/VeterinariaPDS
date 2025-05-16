import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import authenticateToken from '../middlewares/authenticateToken';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const router = Router();

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, authorizeRoles('Admin'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('Admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteProduct);

export default router;
