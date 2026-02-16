import { useState, useEffect } from 'react';
import { productService } from '@/services/api/product.service';
import { ProductDetail } from '@/types/common/product.types';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts();
      if (response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
