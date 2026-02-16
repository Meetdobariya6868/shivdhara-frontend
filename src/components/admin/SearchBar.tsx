import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onFilterClick }) => {
  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 md:py-4 bg-gradient-to-r from-green-100 to-green-50 border-0 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="p-3 md:p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl hover:shadow-md transition-all flex-shrink-0"
          aria-label="Filter"
        >
          <Filter size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};
