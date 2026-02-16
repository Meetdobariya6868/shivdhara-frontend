import React from 'react';
import { Package, TrendingUp, DollarSign, Calendar, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Logo } from '@/components/shared/layout/Logo';
import { getGreeting } from '@/utils/helpers/time.helpers';

export const SalesmanDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const stats = [
    { title: 'Today\'s Sales', value: '12', icon: Package, color: 'bg-blue-500' },
    { title: 'This Week', value: '45', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Revenue', value: '₹2.5L', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'This Month', value: '156', icon: Calendar, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />

            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-700 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Greeting Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getGreeting()} ☀️
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
            {user?.name?.toUpperCase() || 'SALESMAN'}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-2 md:p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
              <Package className="mx-auto mb-2 text-gray-600" size={24} />
              <p className="text-sm font-medium text-gray-700">New Order</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center">
              <TrendingUp className="mx-auto mb-2 text-gray-600" size={24} />
              <p className="text-sm font-medium text-gray-700">View Sales</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center">
              <DollarSign className="mx-auto mb-2 text-gray-600" size={24} />
              <p className="text-sm font-medium text-gray-700">Payments</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center">
              <Calendar className="mx-auto mb-2 text-gray-600" size={24} />
              <p className="text-sm font-medium text-gray-700">Schedule</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Package className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Order #{12340 + item} completed</p>
                  <p className="text-xs text-gray-500">{item} hours ago</p>
                </div>
                <span className="text-sm font-semibold text-green-600">₹2,500</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
