import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbName = process.env.NODE_ENV === 'production' ? '/var/data/database.sqlite' : '../../database.sqlite';
const dbPath = process.env.NODE_ENV === 'production' ? dbName : path.join(__dirname, dbName);

// Ensure database file exists
if (!fs.existsSync(dbPath)) {
    fs.closeSync(fs.openSync(dbPath, 'w'));
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Promise wrapper for SQLite queries
export const pool = {
    execute: (sql: string, params: any[] = []): Promise<any> => {
        return new Promise((resolve, reject) => {
            if (sql.trim().toLowerCase().startsWith('select')) {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve([rows]);
                });
            } else {
                db.run(sql, params, function (err) {
                    if (err) reject(err);
                    else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
                });
            }
        });
    },
    getConnection: async () => {
        // For transactions in SQLite, we need to handle BEGIN/COMMIT/ROLLBACK
        return {
            execute: (sql: string, params: any[] = []) => pool.execute(sql, params),
            beginTransaction: () => pool.execute('BEGIN TRANSACTION'),
            commit: () => pool.execute('COMMIT'),
            rollback: () => pool.execute('ROLLBACK'),
            release: () => { }, // No-op for sqlite3 singleton connection
        };
    }
};

export default pool;
