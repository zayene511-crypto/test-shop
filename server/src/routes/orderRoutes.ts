import { Router } from 'express';
import { createOrder, getSellerOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateJWT, authorizeRole } from '../middlewares/auth';

const router = Router();

// Public route for guest checkout
router.post('/', createOrder);

// Seller/Admin routes
router.get('/seller', authenticateJWT, authorizeRole(['seller', 'admin']), getSellerOrders);
router.put('/:id/status', authenticateJWT, authorizeRole(['seller', 'admin']), updateOrderStatus);

export default router;
