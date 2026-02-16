export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Shivdhara';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROUTES = {
  SPLASH: '/',
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ADD_SALESMAN: '/admin/add-salesman',
  ADMIN_DETAILS: '/admin/details',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_PROFILE_EDIT: '/admin/profile/edit',
  ADMIN_PRIVACY_POLICY: '/admin/privacy-policy',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_MY_PRODUCTS: '/admin/my-products',
  ADMIN_SALESMAN_DETAIL: '/admin/salesman/:id',
  ADMIN_ORDER_DETAIL: '/admin/order/:id',
  SALESMAN_DASHBOARD: '/salesman/dashboard',
  SALESMAN_ORDER_DETAIL: '/salesman/order/:id',
  UNAUTHORIZED: '/unauthorized',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  SALESMAN: 'salesman',
} as const;