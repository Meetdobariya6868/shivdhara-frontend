import { apiService } from './api.service';
import { ProductDetail, ProductFormData } from '@/types/common/product.types';
import { ApiResponse } from '@/types/api.types';

class ProductService {
  async getProducts(): Promise<ApiResponse<ProductDetail[]>> {
    return apiService.get('/products');
  }

  async getProduct(id: string): Promise<ApiResponse<ProductDetail>> {
    return apiService.get(`/products/${id}`);
  }

  async createProduct(data: ProductFormData): Promise<ApiResponse<ProductDetail>> {
    return apiService.post('/products', data);
  }

  async updateProduct(id: string, data: ProductFormData): Promise<ApiResponse<ProductDetail>> {
    return apiService.put(`/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/products/${id}`);
  }
}

export const productService = new ProductService();
