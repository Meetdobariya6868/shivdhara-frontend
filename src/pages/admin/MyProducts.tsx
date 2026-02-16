import React, { useState, useMemo } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/common/PageContainer';
import { SearchInput } from '@/components/common/SearchInput';
import { OrderCard, UserOrder } from '@/components/admin/OrderCard';

// Mock data - replace with API call
const MOCK_ORDERS: UserOrder[] = [
  {
    id: '1',
    userName: 'demo',
    userId: '1234567890',
    userAvatar: undefined,
    date: '18/09/2025',
    status: 'pending',
  },
  {
    id: '2',
    userName: 'demo',
    userId: '1234567890',
    userAvatar: undefined,
    date: '18/09/2025',
    status: 'pending',
  },
  {
    id: '3',
    userName: 'demo2',
    userId: '9876543210',
    userAvatar: undefined,
    date: '29/08/2025',
    status: 'pending',
  },
  {
    id: '4',
    userName: 'demo',
    userId: '6884390465',
    userAvatar: undefined,
    date: '29/08/2025',
    status: 'pending',
  },
  {
    id: '5',
    userName: 'ramjibhai',
    userId: '9834688469',
    userAvatar: undefined,
    date: '26/08/2025',
    status: 'pending',
  },
  {
    id: '6',
    userName: 'my',
    userId: '258',
    userAvatar: undefined,
    date: '20/04/2024',
    status: 'pending',
  },
  {
    id: '7',
    userName: 'yvc',
    userId: '321',
    userAvatar: undefined,
    date: '20/04/2024',
    status: 'pending',
  },
];

export const MyProducts: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_ORDERS;

    const query = searchQuery.toLowerCase();
    return MOCK_ORDERS.filter(
      (order) =>
        order.userName.toLowerCase().includes(query) ||
        order.userId.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleOrderClick = (order: UserOrder) => {
    // Navigate to order detail page
    navigate(`/admin/order/${order.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                My Products
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Search Bar */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
              className="mb-6"
            />

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-0">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={handleOrderClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                {searchQuery ? (
                  <>
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">
                      No orders found matching "{searchQuery}"
                    </p>
                  </>
                ) : (
                  <>
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      No products assigned yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Your assigned products will appear here
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
