import React, { useState, useEffect } from 'react';
import FilterDropdown from './FilterDropdown';
import { Star } from 'lucide-react';

const RatingFilter = ({ selectedRating, onRatingChange, isOpen, onToggle }) => {
  const [tempSelected, setTempSelected] = useState(selectedRating);

  const ratingOptions = [
    { value: null, label: 'Any Rating', stars: 0 },
    { value: 4.5, label: '4.5+ Stars', stars: 4.5 },
    { value: 4.0, label: '4.0+ Stars', stars: 4.0 },
    { value: 3.5, label: '3.5+ Stars', stars: 3.5 },
    { value: 3.0, label: '3.0+ Stars', stars: 3.0 },
  ];

  useEffect(() => {
    setTempSelected(selectedRating);
  }, [selectedRating]);

  const handleRatingSelect = (rating) => {
    setTempSelected(rating);
  };

  const handleApply = () => {
    onRatingChange(tempSelected);
    onToggle(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedRating);
    onToggle(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getSelectedRatingLabel = () => {
    const option = ratingOptions.find(opt => opt.value === selectedRating);
    return option ? option.label : 'Any Rating';
  };

  return (
    <FilterDropdown
      title={`Rating: ${getSelectedRatingLabel()}`}
      isOpen={isOpen}
      onToggle={onToggle}
      hasActiveFilters={selectedRating !== null}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Minimum Rating</h3>
        </div>

        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label
              key={option.label}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={tempSelected === option.value}
                onChange={() => handleRatingSelect(option.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <div className="ml-3 flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[80px]">{option.label}</span>
                {option.stars > 0 && (
                  <div className="flex items-center gap-1">
                    {renderStars(option.stars)}
                  </div>
                )}
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

export default RatingFilter;