import { UserRole } from '@/types/auth.types';
import { ROUTES } from './constants';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardPath = (role: UserRole): string => {
  const roleRoutes: Record<UserRole, string> = {
    admin: ROUTES.ADMIN_DASHBOARD,
    salesman: ROUTES.SALESMAN_DASHBOARD,
  };
  return roleRoutes[role] || ROUTES.LOGIN;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};