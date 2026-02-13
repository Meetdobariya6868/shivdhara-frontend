import { apiService } from './api';
import { LoginCredentials, LoginResponse, User } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/utils/constants';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data?.token) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response.data!;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data!;
  }
}

export const authService = new AuthService();