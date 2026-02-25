import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import initDb from './config/initDb';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import statsRoutes from './routes/statsRoutes';

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

    // Use path.resolve or path.join for uploads
    const uploadsPath = path.join(__dirname, '../uploads');
    if (!require('fs').existsSync(uploadsPath)) {
        require('fs').mkdirSync(uploadsPath, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsPath));

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
