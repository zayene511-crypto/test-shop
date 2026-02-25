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
exports.updateOrderStatus = exports.getSellerOrders = exports.createOrder = void 0;
const db_1 = __importDefault(require("../config/db"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_name, customer_phone, customer_address, items, total_amount } = req.body;
    const connection = yield db_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        // 1. Create order
        const [orderResult] = yield connection.execute('INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount) VALUES (?, ?, ?, ?)', [customer_name, customer_phone, customer_address, total_amount]);
        const orderId = orderResult.insertId;
        // 2. Add order items
        for (const item of items) {
            yield connection.execute('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.product_id, item.quantity, item.price]);
            // Update stock
            yield connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
        }
        yield connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    }
    catch (error) {
        yield connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
    finally {
        connection.release();
    }
});
exports.createOrder = createOrder;
const getSellerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.user.id;
    try {
        // Note: In this simple schema, we fetch all orders but in a real app 
        // we would filter items by seller. For this project, sellers view all orders 
        // as it's a unified marketplace, or we assume orders are global.
        // If we want seller-specific orders, we'd filter by product.seller_id.
        const [rows] = yield db_1.default.execute(`
      SELECT DISTINCT o.* 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ? OR ? = 'admin'
      ORDER BY o.created_at DESC
    `, [sellerId, req.user.role]);
        // Fetch items for each order
        for (const order of rows) {
            const [items] = yield db_1.default.execute(`
        SELECT oi.*, p.name as product_name, p.image_url 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
            order.items = items;
        }
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
exports.getSellerOrders = getSellerOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    try {
        const [result] = yield db_1.default.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order status updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
