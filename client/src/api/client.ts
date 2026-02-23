import axios from 'axios';

/**
 * API base URL configuration
 * - In development: defaults to '/api' (proxied by Vite to backend)
 * - In production: can be overridden via VITE_API_BASE_URL env variable
 * - For Docker: set to 'http://backend:3002/api' or use nginx proxy
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling or logging could go here
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);
