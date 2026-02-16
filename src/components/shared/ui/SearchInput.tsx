import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
  showClearButton = true,
  showFilterButton = false,
  onFilterClick,
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-gradient-to-br from-green-100 to-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all text-base md:text-lg"
        />

        {showClearButton && value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filter Button */}
      {showFilterButton && (
        <button
          onClick={onFilterClick}
          className="p-3 md:p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl hover:shadow-md transition-all flex-shrink-0"
          aria-label="Filter"
        >
          <Filter size={20} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};
