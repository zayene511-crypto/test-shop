import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { authenticateJWT, authorizeRole } from '../middlewares/auth';
import { upload } from '../config/multer';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateJWT, authorizeRole(['admin']), upload.single('image'), createCategory);

export default router;
