import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{value}</h3>
          <div className="mt-2">
            <span
              className={`text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`${color} p-2 md:p-3 rounded-lg`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </div>
  );
};
