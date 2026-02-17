import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/shared/dashboard/DashboardHeader';
import { StatCard } from '@/components/shared/dashboard/StatCard';
import { UserCard } from '@/components/features/salesmen/UserCard';
import { SearchInput } from '@/components/shared/ui/SearchInput';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { mockSalesmen } from '@/mocks/salesmen.mock';
import { getGreeting } from '@/utils/helpers/time.helpers';

const stats = [
  { id: 1, title: 'Total Salesmen', value: '24', icon: Users, color: 'bg-blue-500', change: '+12%' },
  { id: 2, title: 'Total Sales', value: '₹12.5L', icon: TrendingUp, color: 'bg-green-500', change: '+23%' },
  { id: 3, title: 'Revenue', value: '₹45.2L', icon: DollarSign, color: 'bg-purple-500', change: '+18%' },
  { id: 4, title: 'Products', value: '156', icon: Package, color: 'bg-orange-500', change: '+8%' },
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const filteredSalesmen = mockSalesmen.filter(salesman =>
    salesman.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salesman.userId.includes(searchQuery)
  );

  return (
    <PageContainer>
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Greeting Section */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            {getGreeting()} ☀️
          </h1>
          <p className="text-xl md:text-l font-bold text-gray-800 mt-1">
            {user?.name?.toUpperCase() || 'ADMIN'}
          </p>
        </div>

        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          showFilterButton={true}
          onFilterClick={() => setShowFilter(!showFilter)}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map(stat => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Salesmen Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Salesmen ({filteredSalesmen.length})
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>

        {/* Salesmen Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filteredSalesmen.map(salesman => (
            <UserCard key={salesman.id} {...salesman} />
          ))}
        </div>

        {filteredSalesmen.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No salesmen found</p>
          </div>
        )}
      </main>
    </PageContainer>
  );
};
