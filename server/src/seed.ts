import pool from './config/db';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('Starting database seeding...');
        const hashedPassword = await bcrypt.hash('seller123', 10);

        await pool.execute(
            'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Test Seller', 'seller@test.com', hashedPassword, 'seller']
        );

        const [users]: any = await pool.execute('SELECT id FROM users WHERE email = ?', ['seller@test.com']);
        const sellerId = users[0].id;

        const products = [
            ['Organic Apple', 'Fresh organic apples from the orchard', 2.99, 100, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500'],
            ['Farm Fresh Eggs', 'Dozen free-range organic eggs', 5.50, 50, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500'],
            ['Pure Honey', '100% natural wild-flower honey', 12.00, 20, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500']
        ];

        for (const p of products) {
            await pool.execute(
                'INSERT OR IGNORE INTO products (name, description, price, stock, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
                [...p, sellerId]
            );
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
