// Centralized API constants and helpers for the CMS

export const API_URL = import.meta.env.VITE_PUBLIC_API_URL

export const API_ENDPOINTS = {
    LOGIN: `${API_URL}/api/v1/auth/login`,

    USERS: `${API_URL}/api/v1/users`
};