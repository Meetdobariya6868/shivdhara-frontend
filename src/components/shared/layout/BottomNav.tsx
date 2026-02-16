import React from 'react';
import { Home, Filter, UserPlus, FileText, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/admin/dashboard' },
  { id: 'orders', label: 'Orders', icon: Filter, path: '/admin/orders' },
  { id: 'add-salesman', label: 'Add', icon: UserPlus, path: '/admin/add-salesman' },
  { id: 'details', label: 'Details', icon: FileText, path: '/admin/details' },
  { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all hover:bg-gray-50 ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-blue-600' : 'text-gray-600'} md:w-6 md:h-6`} />
              <span className={`text-xs md:text-sm mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
