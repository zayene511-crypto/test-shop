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

const handleResponse = async (res: Response, url: string) => {
    const contentType = res.headers.get('content-type');
    if (!res.ok) {
        console.error(`Request to ${url} failed with status ${res.status}`);
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
        const url = `${API_URL}/products?${params.toString()}`;
        const res = await fetch(url);
        return handleResponse(res, url);
    },
    getProductById: async (id: number) => {
        const url = `${API_URL}/products/${id}`;
        const res = await fetch(url);
        return handleResponse(res, url);
    },

    // Orders
    placeOrder: async (orderData: any) => {
        const url = `${API_URL}/orders`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return handleResponse(res, url);
    },

    // Auth
    login: async (credentials: any) => {
        const url = `${API_URL}/auth/login`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(res, url);
    },

    // Seller Dashboard
    getSellerStats: async () => {
        const url = `${API_URL}/seller/stats`;
        const res = await fetch(url, { headers: getHeaders() });
        return handleResponse(res, url);
    },
    getSellerOrders: async () => {
        const url = `${API_URL}/orders/seller`;
        const res = await fetch(url, { headers: getHeaders() });
        return handleResponse(res, url);
    },
    updateOrderStatus: async (id: number, status: string) => {
        const url = `${API_URL}/orders/${id}/status`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(res, url);
    },

    // Seller Product Management
    createProduct: async (formData: FormData) => {
        const url = `${API_URL}/products`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        return handleResponse(res, url);
    },
    updateProduct: async (id: number, formData: FormData) => {
        const url = `${API_URL}/products/${id}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        return handleResponse(res, url);
    },
    deleteProduct: async (id: number) => {
        const url = `${API_URL}/products/${id}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(res, url);
    }
};
