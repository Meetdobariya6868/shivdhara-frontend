import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}) => {
  const bgColor = variant === 'danger'
    ? 'bg-red-100 hover:bg-red-200 active:bg-red-300'
    : 'bg-green-100 hover:bg-green-200 active:bg-green-300';

  const textColor = variant === 'danger' ? 'text-red-700' : 'text-gray-800';

  return (
    <button
      onClick={onClick}
      className={`w-full ${bgColor} ${textColor} rounded-2xl px-6 py-4 flex items-center gap-4 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]`}
    >
      <div className="flex items-center justify-center w-10 h-10 bg-white/50 rounded-lg">
        <Icon size={22} className={variant === 'danger' ? 'text-red-600' : 'text-gray-700'} />
      </div>
      <span className="text-base md:text-lg font-medium flex-1 text-left">
        {label}
      </span>
    </button>
  );
};
