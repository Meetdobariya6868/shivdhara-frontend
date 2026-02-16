import React from 'react';

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface UserOrder {
  id: string;
  userName: string;
  userId: string;
  userAvatar?: string;
  date: string;
  status: OrderStatus;
}

interface OrderCardProps {
  order: UserOrder;
  onClick?: (order: UserOrder) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-orange-600' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600' },
  completed: { label: 'Completed', color: 'text-green-600' },
  cancelled: { label: 'Cancelled', color: 'text-red-600' },
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const statusConfig = STATUS_CONFIG[order.status];

  const getUserInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mb-6">
      {/* Date Header */}
      <div className="text-sm md:text-base text-gray-600 font-medium mb-2 px-1">
        {order.date}
      </div>

      {/* Order Card */}
      <button
        onClick={() => onClick?.(order)}
        className="w-full bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-left"
      >
        <div className="flex items-center gap-3 md:gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {order.userAvatar ? (
              <img
                src={order.userAvatar}
                alt={order.userName}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
                {getUserInitials(order.userName)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 truncate">
              {order.userName}
            </h3>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              {order.userId}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className={`text-base md:text-lg font-bold ${statusConfig.color} whitespace-nowrap`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
