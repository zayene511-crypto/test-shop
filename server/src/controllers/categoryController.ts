import { Request, Response } from 'express';
import pool from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const [result]: any = await pool.execute(
            'INSERT INTO categories (name, image_url) VALUES (?, ?)',
            [name, image_url]
        );
        res.status(201).json({ message: 'Category created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating category' });
    }
};
