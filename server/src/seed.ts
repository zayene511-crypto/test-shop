import pool from './config/db';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        const hashedPassword = await bcrypt.hash('seller123', 10);
        await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Test Seller', 'seller@test.com', hashedPassword, 'seller']
        );
        console.log('Default seller created:');
        console.log('Email: seller@test.com');
        console.log('Password: seller123');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seed();
