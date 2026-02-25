import { Router } from 'express';
import { getSellerStats } from '../controllers/statsController';
import { authenticateJWT, authorizeRole } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, authorizeRole(['seller', 'admin']), getSellerStats);

export default router;
