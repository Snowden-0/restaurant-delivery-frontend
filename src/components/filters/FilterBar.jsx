import React, { useState } from 'react';
import CuisineFilter from './CuisineFilter';
import RatingFilter from './RatingFilter';
import AvailabilityFilter from './AvailabilityFilter';
import SortDropdown from './SortDropdown';
import { Filter, X, ChevronDown, Utensils, Star, Clock } from 'lucide-react';

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

  // Filter button component for consistent styling
  const FilterButton = ({ 
    icon, 
    label, 
    active, 
    count,
    onClick,
    isOpen,
    dropdownName
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ease-in-out
        ${active 
          ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
          : 'border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white'}
        ${isOpen ? 'ring-2 ring-blue-400 border-blue-300' : ''}`}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {count > 0 && (
        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
      <ChevronDown 
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
  );

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Filters section */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="h-5 w-5 text-blue-500" />
              <span className="text-base font-medium">Filters</span>
            </div>

            <CuisineFilter
              selectedCuisines={filters.cuisines}
              onCuisineChange={handleCuisineChange}
              isOpen={openDropdown === 'cuisine'}
              onToggle={(isOpen) => handleDropdownToggle('cuisine', isOpen)}
              triggerComponent={
                <FilterButton
                  icon={<Utensils className="h-4 w-4" />}
                  label="Cuisine"
                  active={filters.cuisines.length > 0}
                  count={filters.cuisines.length}
                  isOpen={openDropdown === 'cuisine'}
                  dropdownName="cuisine"
                />
              }
            />

            <RatingFilter
              selectedRating={filters.minRating}
              onRatingChange={handleRatingChange}
              isOpen={openDropdown === 'rating'}
              onToggle={(isOpen) => handleDropdownToggle('rating', isOpen)}
              triggerComponent={
                <FilterButton
                  icon={<Star className="h-4 w-4" />}
                  label="Rating"
                  active={filters.minRating !== null}
                  count={filters.minRating !== null ? 1 : 0}
                  isOpen={openDropdown === 'rating'}
                  dropdownName="rating"
                />
              }
            />

            <AvailabilityFilter
              selectedAvailability={filters.isOpen}
              onAvailabilityChange={handleAvailabilityChange}
              isOpen={openDropdown === 'availability'}
              onToggle={(isOpen) => handleDropdownToggle('availability', isOpen)}
              triggerComponent={
                <FilterButton
                  icon={<Clock className="h-4 w-4" />}
                  label="Availability"
                  active={filters.isOpen !== null}
                  count={filters.isOpen !== null ? 1 : 0}
                  isOpen={openDropdown === 'availability'}
                  dropdownName="availability"
                />
              }
            />

            {/* Clear All Filters */}
            {hasActiveFilters() && (
              <button
                onClick={onClearAllFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear all
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              </button>
            )}
          </div>

          {/* Sort Section */}
          <div className="flex items-center gap-3">
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
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-base text-gray-700">
              {hasActiveFilters() ? (
                <>
                  Found <span className="font-semibold text-blue-600">{totalResults}</span> restaurants 
                  matching your filters
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-blue-600">{totalResults}</span> restaurants
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