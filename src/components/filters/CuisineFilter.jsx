import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import FilterDropdown from './FilterDropdown';
import { X } from 'lucide-react';

const CuisineFilter = ({ selectedCuisines, onCuisineChange, isOpen, onToggle }) => {
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedCuisines);

  useEffect(() => {
    fetchCuisines();
  }, []);

  useEffect(() => {
    setTempSelected(selectedCuisines);
  }, [selectedCuisines]);

  const fetchCuisines = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getAllCuisines();
      setCuisines(data);
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineToggle = (cuisineId) => {
    setTempSelected(prev => 
      prev.includes(cuisineId)
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const handleApply = () => {
    onCuisineChange(tempSelected);
    onToggle(false);
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  const handleCancel = () => {
    setTempSelected(selectedCuisines);
    onToggle(false);
  };

  const getSelectedCuisineNames = () => {
    return cuisines
      .filter(cuisine => selectedCuisines.includes(cuisine.id))
      .map(cuisine => cuisine.name);
  };

  return (
    <FilterDropdown
      title={`Cuisines ${selectedCuisines.length > 0 ? `(${selectedCuisines.length})` : ''}`}
      isOpen={isOpen}
      onToggle={onToggle}
      hasActiveFilters={selectedCuisines.length > 0}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Select Cuisines</h3>
          {tempSelected.length > 0 && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>

        {/* Selected cuisines summary */}
        {selectedCuisines.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2">Currently selected:</div>
            <div className="flex flex-wrap gap-1">
              {getSelectedCuisineNames().map((name) => (
                <span
                  key={name}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {cuisines.map((cuisine) => (
                <label
                  key={cuisine.id}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(cuisine.id)}
                    onChange={() => handleCuisineToggle(cuisine.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">{cuisine.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

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
            Apply ({tempSelected.length})
          </button>
        </div>
      </div>
    </FilterDropdown>
  );
};

export default CuisineFilter;