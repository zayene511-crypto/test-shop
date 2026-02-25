import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import initDb from './config/initDb';

// Load environment variables
dotenv.config();

const startServer = async () => {
    // Initialize Database
    await initDb();

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Basic route
    app.get('/', (req, res) => {
        res.send('Test Shopping API is running...');
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/seller/stats', statsRoutes);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
