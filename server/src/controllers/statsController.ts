import { Request, Response } from 'express';
import pool from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const getSellerStats = async (req: AuthRequest, res: Response) => {
    const sellerId = req.user.id;
    try {
        // Total sales (sum of price * quantity for seller's products in delivered orders)
        const [salesResult]: any = await pool.execute(`
      SELECT SUM(oi.price * oi.quantity) as total_sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE (p.seller_id = ? OR ? = 'admin') AND o.status = 'delivered'
    `, [sellerId, req.user.role]);

        // Total orders count
        const [ordersResult]: any = await pool.execute(`
      SELECT COUNT(DISTINCT o.id) as total_orders
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ? OR ? = 'admin'
    `, [sellerId, req.user.role]);

        // Product count
        const [productsResult]: any = await pool.execute(`
      SELECT COUNT(*) as total_products FROM products WHERE seller_id = ? OR ? = 'admin'
    `, [sellerId, req.user.role]);

        res.json({
            total_sales: salesResult[0].total_sales || 0,
            total_orders: ordersResult[0].total_orders || 0,
            total_products: productsResult[0].total_products || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
