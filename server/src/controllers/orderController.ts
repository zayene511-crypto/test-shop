import { Request, Response } from 'express';
import pool from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const createOrder = async (req: Request, res: Response) => {
    const { customer_name, customer_phone, customer_address, items, total_amount } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create order
        const [orderResult]: any = await connection.execute(
            'INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount) VALUES (?, ?, ?, ?)',
            [customer_name, customer_phone, customer_address, total_amount]
        );
        const orderId = orderResult.insertId;

        // 2. Add order items
        for (const item of items) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Update stock
            await connection.execute(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    } finally {
        connection.release();
    }
};

export const getSellerOrders = async (req: AuthRequest, res: Response) => {
    const sellerId = req.user.id;
    try {
        // Note: In this simple schema, we fetch all orders but in a real app 
        // we would filter items by seller. For this project, sellers view all orders 
        // as it's a unified marketplace, or we assume orders are global.
        // If we want seller-specific orders, we'd filter by product.seller_id.
        const [rows]: any = await pool.execute(`
      SELECT DISTINCT o.* 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ? OR ? = 'admin'
      ORDER BY o.created_at DESC
    `, [sellerId, req.user.role]);

        // Fetch items for each order
        for (const order of rows) {
            const [items]: any = await pool.execute(`
        SELECT oi.*, p.name as product_name, p.image_url 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
            order.items = items;
        }

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    try {
        const [result]: any = await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
