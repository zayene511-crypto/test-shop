/// <reference types="vite/client" />
const envUrl = import.meta.env.VITE_API_BASE_URL;
// In production, we should NOT fallback to localhost as it won't work on mobile.
export const BASE_URL = envUrl && envUrl !== "" ? envUrl : (import.meta.env.DEV ? 'http://localhost:5000' : '');
const API_URL = `${BASE_URL}/api`;

console.log('--- API CONFIGURATION ---');
console.log('Mode:', import.meta.env.MODE);
console.log('Base URL:', BASE_URL || 'MISSING (Check VITE_API_BASE_URL)');
console.log('-------------------------');

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const api = {
    // Products
    getProducts: async (search?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        const res = await fetch(`${API_URL}/products?${params.toString()}`);
        return res.json();
    },
    getProductById: async (id: number) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        return res.json();
    },

    // Orders
    placeOrder: async (orderData: any) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return res.json();
    },

    // Auth
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return res.json();
    },

    // Seller Dashboard
    getSellerStats: async () => {
        const res = await fetch(`${API_URL}/seller/stats`, { headers: getHeaders() });
        return res.json();
    },
    getSellerOrders: async () => {
        const res = await fetch(`${API_URL}/orders/seller`, { headers: getHeaders() });
        return res.json();
    },
    updateOrderStatus: async (id: number, status: string) => {
        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return res.json();
    },

    // Seller Product Management
    createProduct: async (formData: FormData) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        return res.json();
    },
    updateProduct: async (id: number, formData: FormData) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        return res.json();
    },
    deleteProduct: async (id: number) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return res.json();
    }
};
