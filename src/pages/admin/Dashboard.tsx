import React from 'react';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={24} />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-200">
              {user?.name}
            </span>
            <Button variant="outline" onClick={handleLogout} className="!border-white !text-white hover:!bg-white/10 text-sm">
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-500">
            Role: <span className="font-medium text-primary-700 capitalize">{user?.role}</span>
          </p>
        </div>
      </main>
    </div>
  );
};
