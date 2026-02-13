import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  icon, 
  error, 
  className = '', 
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full px-4 py-4 ${icon ? 'pl-12' : ''} rounded-full bg-[#d4e4d8] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'ring-2 ring-red-500' : ''
          } ${className}`}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 px-4">{error}</p>
      )}
    </div>
  );
};