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

export interface DashboardStats {
  id: number;
  title: string;
  value: string;
  change: string;
}

export interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}
