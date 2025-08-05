import React, { useState, useEffect } from 'react';
import FilterDropdown from './FilterDropdown';

const AvailabilityFilter = ({ selectedAvailability, onAvailabilityChange, isOpen, onToggle }) => {
  const [tempSelected, setTempSelected] = useState(selectedAvailability);

  const availabilityOptions = [
    { value: null, label: 'All Restaurants', description: 'Show both open and closed' },
    { value: true, label: 'Open Now', description: 'Only open restaurants' },
    { value: false, label: 'Closed', description: 'Only closed restaurants' },
  ];

  useEffect(() => {
    setTempSelected(selectedAvailability);
  }, [selectedAvailability]);

  const handleAvailabilitySelect = (availability) => {
    setTempSelected(availability);
  };

  const handleApply = () => {
    onAvailabilityChange(tempSelected);
    onToggle(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedAvailability);
    onToggle(false);
  };

  const getSelectedLabel = () => {
    const option = availabilityOptions.find(opt => opt.value === selectedAvailability);
    return option ? option.label : 'All Restaurants';
  };

  const getStatusIcon = (isOpen) => {
    if (isOpen === null) return '🏪';
    return isOpen ? '🟢' : '🔴';
  };

  return (
    <FilterDropdown
      title={`Status: ${getSelectedLabel()}`}
      isOpen={isOpen}
      onToggle={onToggle}
      hasActiveFilters={selectedAvailability !== null}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Restaurant Status</h3>
        </div>

        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label
              key={option.label}
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="availability"
                checked={tempSelected === option.value}
                onChange={() => handleAvailabilitySelect(option.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 mt-0.5"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getStatusIcon(option.value)}</span>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </FilterDropdown>
  );
};

export default AvailabilityFilter;