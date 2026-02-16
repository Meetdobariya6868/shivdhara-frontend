import { apiService } from './api.service';
import { Salesman } from '@/types/common/user.types';
import { ApiResponse } from '@/types/api.types';

interface CreateSalesmanData {
  name: string;
  userId: string;
  password: string;
  email?: string;
  phone?: string;
}

class SalesmanService {
  async getSalesmen(): Promise<ApiResponse<Salesman[]>> {
    return apiService.get('/salesmen');
  }

  async getSalesman(id: number): Promise<ApiResponse<Salesman>> {
    return apiService.get(`/salesmen/${id}`);
  }

  async createSalesman(data: CreateSalesmanData): Promise<ApiResponse<Salesman>> {
    return apiService.post('/salesmen', data);
  }

  async updateSalesman(id: number, data: Partial<Salesman>): Promise<ApiResponse<Salesman>> {
    return apiService.put(`/salesmen/${id}`, data);
  }

  async deleteSalesman(id: number): Promise<ApiResponse<void>> {
    return apiService.delete(`/salesmen/${id}`);
  }
}

export const salesmanService = new SalesmanService();
