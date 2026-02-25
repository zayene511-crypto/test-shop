import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateJWT, authorizeRole } from '../middlewares/auth';
import { upload } from '../config/multer';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller/Admin routes
router.post('/', authenticateJWT, authorizeRole(['seller', 'admin']), upload.single('image'), createProduct);
router.put('/:id', authenticateJWT, authorizeRole(['seller', 'admin']), upload.single('image'), updateProduct);
router.delete('/:id', authenticateJWT, authorizeRole(['seller', 'admin']), deleteProduct);

export default router;
