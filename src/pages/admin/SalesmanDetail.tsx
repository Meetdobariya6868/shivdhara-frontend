import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Edit, Phone, User as UserIcon } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { SearchInput } from '@/components/common/SearchInput';
import { OrderCard, UserOrder } from '@/components/admin/OrderCard';

interface SalesmanData {
  id: string;
  name: string;
  salesmanId: string;
  contactNumber: string;
  avatar?: string;
  totalItems: number;
  orders: UserOrder[];
}

// Mock data - replace with actual API call
const mockSalesmanData: Record<string, SalesmanData> = {
  '1': {
    id: '1',
    name: 'Yogesh Patel',
    salesmanId: '96653',
    contactNumber: '9876543210',
    avatar: undefined,
    totalItems: 856,
    orders: [
      {
        id: '1',
        userName: 'Amit Shah',
        userId: '7845123698',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'pending',
      },
      {
        id: '2',
        userName: 'Priya Desai',
        userId: '9512367845',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'confirmed',
      },
      {
        id: '3',
        userName: 'Kiran Patel',
        userId: '8523697410',
        userAvatar: undefined,
        date: '15/02/2026',
        status: 'completed',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Rajubhai Mehta',
    salesmanId: '56557',
    contactNumber: '8141066663',
    avatar: 'https://i.pravatar.cc/150?img=1',
    totalItems: 1425,
    orders: [
      {
        id: '1',
        userName: 'Arc Shrirajbhai',
        userId: '7621998800',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'pending',
      },
      {
        id: '2',
        userName: 'Pranjal Bordia',
        userId: '6376961258',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'pending',
      },
      {
        id: '3',
        userName: 'Shaileshbhai Donda',
        userId: '9820277331',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'pending',
      },
      {
        id: '4',
        userName: 'Mohsinbhai Halawala',
        userId: '0',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'pending',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Kevalbhai Ambani',
    salesmanId: '15246',
    contactNumber: '9825478963',
    avatar: undefined,
    totalItems: 2103,
    orders: [
      {
        id: '1',
        userName: 'Ramesh Kumar',
        userId: '9638527410',
        userAvatar: undefined,
        date: '16/02/2026',
        status: 'confirmed',
      },
    ],
  },
};

export const SalesmanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // Get salesman data - replace with actual API call
  const salesmanData = id ? mockSalesmanData[id] : undefined;

  if (!salesmanData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-600">Salesman not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const getUserInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const filteredOrders = salesmanData.orders.filter(
    (order) =>
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId.includes(searchQuery)
  );

  const handleEditClick = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit salesman:', salesmanData.id);
  };

  const handleOrderClick = (order: UserOrder) => {
    // Navigate to order detail page
    navigate(`/admin/order/${order.id}`);
  };

  return (
    <PageContainer>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>

            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex-1 text-center px-4 truncate">
              {salesmanData.name}
            </h1>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreVertical size={24} className="text-gray-900" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        handleEditClick();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = `tel:${salesmanData.contactNumber}`;
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-2"
                    >
                      <Phone size={16} />
                      Call
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 pb-6">
          {/* Search Input */}
          <div className="py-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
            />
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl mb-6">
            <div className="flex items-start gap-4 md:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {salesmanData.avatar ? (
                  <img
                    src={salesmanData.avatar}
                    alt={salesmanData.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-green-100"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center ring-4 ring-green-100">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {getUserInitials(salesmanData.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-center mb-1">
                      <p className="text-3xl md:text-4xl font-bold text-gray-900">
                        {salesmanData.totalItems}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        Total item
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={handleEditClick}
                    className="flex-shrink-0 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <UserIcon size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">
                  Salesmen ID:{' '}
                  <span className="text-gray-900 font-semibold">
                    {salesmanData.salesmanId}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <Phone size={18} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">
                  Salesmen Contact No:{' '}
                  <a
                    href={`tel:${salesmanData.contactNumber}`}
                    className="text-gray-900 font-semibold hover:text-green-600 transition-colors"
                  >
                    {salesmanData.contactNumber}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={handleOrderClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 font-medium">
                  {searchQuery ? 'No orders found' : 'No orders yet'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </PageContainer>
  );
};
