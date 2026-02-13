export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Shivdhara';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROUTES = {
  SPLASH: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;