"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSellerStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getSellerStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.user.id;
    try {
        // Total sales (sum of price * quantity for seller's products in delivered orders)
        const [salesResult] = yield db_1.default.execute(`
      SELECT SUM(oi.price * oi.quantity) as total_sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE (p.seller_id = ? OR ? = 'admin') AND o.status = 'delivered'
    `, [sellerId, req.user.role]);
        // Total orders count
        const [ordersResult] = yield db_1.default.execute(`
      SELECT COUNT(DISTINCT o.id) as total_orders
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ? OR ? = 'admin'
    `, [sellerId, req.user.role]);
        // Product count
        const [productsResult] = yield db_1.default.execute(`
      SELECT COUNT(*) as total_products FROM products WHERE seller_id = ? OR ? = 'admin'
    `, [sellerId, req.user.role]);
        res.json({
            total_sales: salesResult[0].total_sales || 0,
            total_orders: ordersResult[0].total_orders || 0,
            total_products: productsResult[0].total_products || 0,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});
exports.getSellerStats = getSellerStats;
