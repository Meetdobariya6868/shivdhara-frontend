import React from 'react';
import { User, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  id: number;
  name: string;
  userId: string;
  avatar?: string | null;
  sales?: number;
  performance?: number;
}

export const UserCard: React.FC<UserCardProps> = ({ id, name, userId, avatar, sales, performance }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/salesman/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer group transform hover:scale-105 active:scale-95"
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-white"
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-full flex items-center justify-center ring-4 ring-white">
              <User size={32} className="text-white" />
            </div>
          )}
          {performance && performance > 90 && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 p-1 rounded-full">
              <TrendingUp size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-1">
          {name}
        </h3>

        {/* User ID */}
        <p className="text-gray-600 text-sm md:text-base font-medium">{userId}</p>

        {/* Performance Badge - Optional */}
        {sales !== undefined && (
          <div className="mt-3 w-full pt-3 border-t border-green-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Sales:</span>
              <span className="font-semibold text-green-700">{sales}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
