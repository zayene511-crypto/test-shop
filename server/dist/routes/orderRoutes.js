"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public route for guest checkout
router.post('/', orderController_1.createOrder);
// Seller/Admin routes
router.get('/seller', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['seller', 'admin']), orderController_1.getSellerOrders);
router.put('/:id/status', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['seller', 'admin']), orderController_1.updateOrderStatus);
exports.default = router;
