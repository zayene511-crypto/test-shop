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

const handleResponse = async (res: Response) => {
    const contentType = res.headers.get('content-type');
    if (!res.ok) {
        const errorData = contentType?.includes('application/json') ? await res.json() : null;
        throw new Error(errorData?.message || `Server error: ${res.status}`);
    }
    if (!contentType?.includes('application/json')) {
        console.error('Expected JSON but received:', contentType);
        const text = await res.text();
        console.log('Response snippet:', text.substring(0, 100));
        throw new Error('Invalid server response (not JSON). Check your VITE_API_BASE_URL.');
    }
    return res.json();
};

export const api = {
    // Products
    getProducts: async (search?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        const res = await fetch(`${API_URL}/products?${params.toString()}`);
        return handleResponse(res);
    },
    getProductById: async (id: number) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        return handleResponse(res);
    },

    // Orders
    placeOrder: async (orderData: any) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return handleResponse(res);
    },

    // Auth
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(res);
    },

    // Seller Dashboard
    getSellerStats: async () => {
        const res = await fetch(`${API_URL}/seller/stats`, { headers: getHeaders() });
        return handleResponse(res);
    },
    getSellerOrders: async () => {
        const res = await fetch(`${API_URL}/orders/seller`, { headers: getHeaders() });
        return handleResponse(res);
    },
    updateOrderStatus: async (id: number, status: string) => {
        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(res);
    },

    // Seller Product Management
    createProduct: async (formData: FormData) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        return handleResponse(res);
    },
    updateProduct: async (id: number, formData: FormData) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        return handleResponse(res);
    },
    deleteProduct: async (id: number) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res);
    }
};
