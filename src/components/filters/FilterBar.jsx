import React, { useState } from 'react';
import CuisineFilter from './CuisineFilter';
import RatingFilter from './RatingFilter';
import AvailabilityFilter from './AvailabilityFilter';
import SortDropdown from './SortDropdown';
import { Filter, X } from 'lucide-react';

const FilterBar = ({ 
  filters, 
  onFiltersChange, 
  sortOption,
  onSortChange,
  onClearAllFilters,
  totalResults 
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (dropdownName, isOpen) => {
    setOpenDropdown(isOpen ? dropdownName : null);
  };

  const handleCuisineChange = (cuisines) => {
    onFiltersChange({ ...filters, cuisines });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const handleAvailabilityChange = (availability) => {
    onFiltersChange({ ...filters, isOpen: availability });
  };

  const hasActiveFilters = () => {
    return filters.cuisines.length > 0 || 
           filters.minRating !== null || 
           filters.isOpen !== null;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.cuisines.length > 0) count++;
    if (filters.minRating !== null) count++;
    if (filters.isOpen !== null) count++;
    return count;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Section */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <CuisineFilter
              selectedCuisines={filters.cuisines}
              onCuisineChange={handleCuisineChange}
              isOpen={openDropdown === 'cuisine'}
              onToggle={(isOpen) => handleDropdownToggle('cuisine', isOpen)}
            />

            <RatingFilter
              selectedRating={filters.minRating}
              onRatingChange={handleRatingChange}
              isOpen={openDropdown === 'rating'}
              onToggle={(isOpen) => handleDropdownToggle('rating', isOpen)}
            />

            <AvailabilityFilter
              selectedAvailability={filters.isOpen}
              onAvailabilityChange={handleAvailabilityChange}
              isOpen={openDropdown === 'availability'}
              onToggle={(isOpen) => handleDropdownToggle('availability', isOpen)}
            />

            {/* Clear All Filters */}
            {hasActiveFilters() && (
              <button
                onClick={onClearAllFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-3 w-3" />
                Clear All ({getActiveFiltersCount()})
              </button>
            )}
          </div>

          {/* Sort Section */}
          <div className="flex items-center gap-3 sm:ml-auto">
            <SortDropdown
              selectedSort={sortOption}
              onSortChange={onSortChange}
              isOpen={openDropdown === 'sort'}
              onToggle={(isOpen) => handleDropdownToggle('sort', isOpen)}
            />
          </div>
        </div>

        {/* Results Summary */}
        {totalResults !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {hasActiveFilters() ? (
                <>
                  Found <span className="font-medium text-gray-900">{totalResults}</span> restaurants 
                  matching your filters
                </>
              ) : (
                <>
                  Showing <span className="font-medium text-gray-900">{totalResults}</span> restaurants
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;