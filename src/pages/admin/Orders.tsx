import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, Calendar, User, Package } from 'lucide-react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { PageContainer } from '@/components/common/PageContainer';

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  productName: string;
  salesmanName: string;
  status: OrderStatus;
  date: string;
  amount: string;
}

const mockOrders: Order[] = [
  { id: '#12345', productName: 'Product A', salesmanName: 'Yogesh Patel', status: 'pending', date: '2024-02-15', amount: '₹5,000' },
  { id: '#12346', productName: 'Product B', salesmanName: 'Rajubhai Mehta', status: 'confirmed', date: '2024-02-14', amount: '₹3,500' },
  { id: '#12347', productName: 'Product C', salesmanName: 'Kevalbhai Ambani', status: 'delivered', date: '2024-02-13', amount: '₹7,200' },
  { id: '#12348', productName: 'Product D', salesmanName: 'VIVEK KORAT', status: 'pending', date: '2024-02-12', amount: '₹4,800' },
  { id: '#12349', productName: 'Product E', salesmanName: 'Prakash Shah', status: 'confirmed', date: '2024-02-11', amount: '₹6,100' },
];

const statusColors = {
  all: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const Orders: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all');
  const [selectedSalesman, setSelectedSalesman] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const salesmen = ['all', ...Array.from(new Set(mockOrders.map(o => o.salesmanName)))];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSalesman = selectedSalesman === 'all' || order.salesmanName === selectedSalesman;
    const matchesDate = !selectedDate || order.date === selectedDate;

    return matchesSearch && matchesStatus && matchesSalesman && matchesDate;
  });

  const clearFilters = () => {
    setSelectedStatus('all');
    setSelectedSalesman('all');
    setSelectedDate('');
    setSearchQuery('');
  };

  return (
    <PageContainer>
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage and filter all orders</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or order ID..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={20} />
            <span className="hidden md:inline">Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Smart Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Order Status Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Package size={16} />
                  Order Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Salesman Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} />
                  Salesman
                </label>
                <select
                  value={selectedSalesman}
                  onChange={(e) => setSelectedSalesman(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  {salesmen.map(salesman => (
                    <option key={salesman} value={salesman}>
                      {salesman === 'all' ? 'All Salesmen' : salesman}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedStatus !== 'all' || selectedSalesman !== 'all' || selectedDate) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Status: {selectedStatus}
                <X size={14} className="cursor-pointer" onClick={() => setSelectedStatus('all')} />
              </span>
            )}
            {selectedSalesman !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Salesman: {selectedSalesman}
                <X size={14} className="cursor-pointer" onClick={() => setSelectedSalesman('all')} />
              </span>
            )}
            {selectedDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Date: {selectedDate}
                <X size={14} className="cursor-pointer" onClick={() => setSelectedDate('')} />
              </span>
            )}
          </div>
        )}

        {/* Orders Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{mockOrders.length}</span> orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{order.productName}</h3>
                  <p className="text-sm text-gray-600">{order.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Salesman</p>
                  <p className="font-medium text-gray-900">{order.salesmanName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{order.date}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium text-green-600">{order.amount}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">No orders found matching your filters</p>
            </div>
          )}
        </div>
      </main>
    </PageContainer>
  );
};
