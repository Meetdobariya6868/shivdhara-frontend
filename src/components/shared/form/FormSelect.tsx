import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  required = false,
  error,
}) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <Icon size={16} />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-10 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
