"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
// Public routes
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
// Seller/Admin routes
router.post('/', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['seller', 'admin']), multer_1.upload.single('image'), productController_1.createProduct);
router.put('/:id', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['seller', 'admin']), multer_1.upload.single('image'), productController_1.updateProduct);
router.delete('/:id', auth_1.authenticateJWT, (0, auth_1.authorizeRole)(['seller', 'admin']), productController_1.deleteProduct);
exports.default = router;
