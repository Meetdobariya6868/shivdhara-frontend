import React from 'react';
import { Loader } from './Loader';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick,
  loading = false, 
  disabled = false,
  className = '',
  type = 'button',
  variant = 'primary',
}) => {
  const baseClasses = 'px-8 py-3 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variantClasses = {
    primary: 'bg-[#1a4132] text-white hover:bg-[#246249]',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'bg-transparent border-2 border-[#1a4132] text-[#1a4132] hover:bg-[#1a4132] hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader size={20} />
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};