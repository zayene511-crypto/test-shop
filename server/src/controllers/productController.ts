import { Request, Response } from 'express';
import pool from '../config/db';

interface AuthRequest extends Request {
    user?: any;
}

export const getProducts = async (req: Request, res: Response) => {
    const { search } = req.query;
    let query = 'SELECT * FROM products';
    let params: any[] = [];

    if (search) {
        query += ' WHERE (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    try {
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    const { name, description, price, stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const seller_id = req.user.id;

    try {
        const [result]: any = await pool.execute(
            'INSERT INTO products (name, description, price, stock, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, image_url, seller_id]
        );
        res.status(201).json({ message: 'Product created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    const { name, description, price, stock } = req.body;
    const seller_id = req.user.id;

    try {
        let query = 'UPDATE products SET name=?, description=?, price=?, stock=?';
        let params = [name, description, price, stock];

        if (req.file) {
            query += ', image_url=?';
            params.push(`/uploads/${req.file.filename}`);
        }

        query += ' WHERE id=? AND seller_id=?';
        params.push(req.params.id, seller_id);

        const [result]: any = await pool.execute(query, params);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });

        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    const seller_id = req.user.id;
    try {
        const [result]: any = await pool.execute('DELETE FROM products WHERE id=? AND seller_id=?', [req.params.id, seller_id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};
