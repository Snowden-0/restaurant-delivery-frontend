import React, { useState, useEffect } from 'react';
import FilterDropdown from './FilterDropdown';
import { ArrowUpDown, Star, Type } from 'lucide-react';

const SortDropdown = ({ selectedSort, onSortChange, isOpen, onToggle }) => {
  const [tempSelected, setTempSelected] = useState(selectedSort);

  const sortOptions = [
    { 
      value: 'name-asc', 
      label: 'Name (A-Z)', 
      icon: <Type className="h-4 w-4" />,
      description: 'Alphabetical order' 
    },
    { 
      value: 'name-desc', 
      label: 'Name (Z-A)', 
      icon: <Type className="h-4 w-4" />,
      description: 'Reverse alphabetical' 
    },
    { 
      value: 'rating-desc', 
      label: 'Highest Rated', 
      icon: <Star className="h-4 w-4" />,
      description: 'Best ratings first' 
    },
    { 
      value: 'rating-asc', 
      label: 'Lowest Rated', 
      icon: <Star className="h-4 w-4" />,
      description: 'Lowest ratings first' 
    },
  ];

  useEffect(() => {
    setTempSelected(selectedSort);
  }, [selectedSort]);

  const handleSortSelect = (sortValue) => {
    setTempSelected(sortValue);
  };

  const handleApply = () => {
    onSortChange(tempSelected);
    onToggle(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedSort);
    onToggle(false);
  };

  const getSelectedLabel = () => {
    const option = sortOptions.find(opt => opt.value === selectedSort);
    return option ? option.label : 'Name (A-Z)';
  };

  return (
    <FilterDropdown
      title={
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort: {getSelectedLabel()}</span>
        </div>
      }
      isOpen={isOpen}
      onToggle={onToggle}
      hasActiveFilters={selectedSort !== 'name-asc'}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Sort Restaurants</h3>
        </div>

        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="sort"
                checked={tempSelected === option.value}
                onChange={() => handleSortSelect(option.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 mt-0.5"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-gray-500">{option.icon}</div>
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

export default SortDropdown;