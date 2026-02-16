// Salesman interface
export interface Salesman {
  id: number;
  name: string;
  userId: string;
  avatar?: string | null;
  sales?: number;
  performance?: number;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
  joinedDate?: string;
}

// Dashboard statistics interface
export interface DashboardStats {
  id: number;
  title: string;
  value: string;
  change: string;
  icon?: any; // LucideIcon type
  color?: string;
}
