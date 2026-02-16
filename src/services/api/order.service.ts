import { apiService } from './api.service';
import { OrderDetail, OrderListItem, OrderStatus } from '@/types/common/order.types';
import { ApiResponse } from '@/types/api.types';

class OrderService {
  async getOrders(): Promise<ApiResponse<OrderListItem[]>> {
    return apiService.get('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<OrderDetail>> {
    return apiService.get(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<OrderDetail>> {
    return apiService.put(`/orders/${id}/status`, { status });
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();
