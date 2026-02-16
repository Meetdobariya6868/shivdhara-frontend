import { useState, useEffect } from 'react';
import { orderService } from '@/services/api/order.service';
import { OrderListItem } from '@/types/common/order.types';

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};
