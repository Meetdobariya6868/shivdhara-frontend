export interface User {
  id: number;
  userId: string;
  name: string;
  email?: string;
  role: string;
  createdAt?: string;
}

export interface LoginCredentials {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}