import React from 'react';
import { LogOut, Bell, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Logo } from '@/components/shared/layout/Logo';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Menu */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} className="text-gray-700" />
            </button>
            <Logo size="sm" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
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
  );
};
