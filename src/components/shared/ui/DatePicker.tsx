import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const displayDate = (dateString: string): string => {
    if (!dateString) return 'No date selected';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  const handleDateClick = () => {
    if (!disabled) {
      const input = document.getElementById('date-input-hidden') as HTMLInputElement;
      input?.showPicker?.();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Date Display */}
      <div className="text-center">
        <p className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
          Selected Date:
        </p>
        <p className="text-3xl md:text-4xl font-bold text-gray-900">
          {displayDate(value)}
        </p>
      </div>

      {/* Date Picker Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleDateClick}
          disabled={disabled}
          className="text-green-600 hover:text-green-700 font-semibold text-lg md:text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select Date
        </button>
      </div>

      {/* Hidden Native Date Input */}
      <input
        id="date-input-hidden"
        type="date"
        value={formatDate(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="sr-only"
      />
    </div>
  );
};
