import { ProductDetail } from './product.types';

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'delivered';

// Order in list view
export interface OrderListItem {
  id: string;
  userName: string;
  userId: string;
  userAvatar?: string;
  date: string;
  status: OrderStatus;
  amount?: string;
  productName?: string;
  salesmanName?: string;
}

// Order detail view
export interface OrderDetail {
  id: string;
  customer: {
    name: string;
    mobileNo: string;
    orderType: 'Local' | 'Station';
  };
  payment: {
    transportationCharge: number;
    advancePayment: number;
    remainingPayment: number;
    totalPayment: number;
  };
  products: ProductDetail[];
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

// Order status configuration
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-orange-600' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600' },
  completed: { label: 'Completed', color: 'text-green-600' },
  cancelled: { label: 'Cancelled', color: 'text-red-600' },
  delivered: { label: 'Delivered', color: 'text-green-600' },
};
