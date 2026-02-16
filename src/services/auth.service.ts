import { LoginCredentials, LoginResponse, User } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/utils/constants';

// Static user credentials for development
const STATIC_USERS = {
  meet: {
    userId: 'meet',
    password: '123456',
    user: {
      id: 1,
      userId: 'meet',
      name: 'Meet Dev',
      email: 'meet@shivdhara.com',
      role: 'salesman' as const,
    },
  },
  admin: {
    userId: 'admin',
    password: '123456',
    user: {
      id: 2,
      userId: 'admin',
      name: 'Admin User',
      email: 'admin@shivdhara.com',
      role: 'admin' as const,
    },
  },
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const staticUser = STATIC_USERS[credentials.userId as keyof typeof STATIC_USERS];

    if (!staticUser || staticUser.password !== credentials.password) {
      throw new Error('Invalid credentials. Please check your username and password.');
    }

    const token = `static-token-${staticUser.userId}-${Date.now()}`;
    const response: LoginResponse = {
      token,
      user: staticUser.user,
      message: 'Login successful',
    };

    this.setToken(response.token);
    this.setUser(response.user);

    return response;
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
    const user = this.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }
    return user;
  }
}

export const authService = new AuthService();