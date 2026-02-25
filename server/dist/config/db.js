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
exports.pool = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbName = process.env.NODE_ENV === 'production' ? '/var/data/database.sqlite' : '../../database.sqlite';
const dbPath = process.env.NODE_ENV === 'production' ? dbName : path_1.default.join(__dirname, dbName);
// Ensure database file exists
if (!fs_1.default.existsSync(dbPath)) {
    fs_1.default.closeSync(fs_1.default.openSync(dbPath, 'w'));
}
const db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    }
    else {
        console.log('Connected to the SQLite database.');
    }
});
// Promise wrapper for SQLite queries
exports.pool = {
    execute: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            if (sql.trim().toLowerCase().startsWith('select')) {
                db.all(sql, params, (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve([rows]);
                });
            }
            else {
                db.run(sql, params, function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
                });
            }
        });
    },
    getConnection: () => __awaiter(void 0, void 0, void 0, function* () {
        // For transactions in SQLite, we need to handle BEGIN/COMMIT/ROLLBACK
        return {
            execute: (sql, params = []) => exports.pool.execute(sql, params),
            beginTransaction: () => exports.pool.execute('BEGIN TRANSACTION'),
            commit: () => exports.pool.execute('COMMIT'),
            rollback: () => exports.pool.execute('ROLLBACK'),
            release: () => { }, // No-op for sqlite3 singleton connection
        };
    })
};
exports.default = exports.pool;
