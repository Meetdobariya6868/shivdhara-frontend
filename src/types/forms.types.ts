// Form-specific types
export interface LoginFormData {
  userId: string;
  password: string;
}

export interface SalesmanFormData {
  name: string;
  userId: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface ProfileFormData {
  name: string;
  email?: string;
  phone?: string;
  avatar?: File | null;
}
