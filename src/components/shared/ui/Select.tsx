import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  error,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-4 pr-12 rounded-xl bg-[#d4e4d8] text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4132] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'ring-2 ring-red-500' : ''
          } ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
          <ChevronDown size={20} />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 px-4">{error}</p>}
    </div>
  );
};
