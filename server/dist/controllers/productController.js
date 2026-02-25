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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = __importDefault(require("../config/db"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];
    if (search) {
        query += ' WHERE (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    try {
        const [rows] = yield db_1.default.execute(query, params);
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const seller_id = req.user.id;
    try {
        const [result] = yield db_1.default.execute('INSERT INTO products (name, description, price, stock, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?)', [name, description, price, stock, image_url, seller_id]);
        res.status(201).json({ message: 'Product created', id: result.insertId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [result] = yield db_1.default.execute(query, params);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const seller_id = req.user.id;
    try {
        const [result] = yield db_1.default.execute('DELETE FROM products WHERE id=? AND seller_id=?', [req.params.id, seller_id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
