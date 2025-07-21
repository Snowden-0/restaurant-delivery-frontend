// components/ui/CuisineFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, X, Check } from 'lucide-react';
import { restaurantService } from '../../services/restaurantService';

const CuisineFilter = ({ onFilterChange, selectedCuisines = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableCuisines, setAvailableCuisines] = useState([]);
  const [tempSelectedCuisines, setTempSelectedCuisines] = useState(selectedCuisines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch all available cuisines on component mount
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        setLoading(true);
        setError(null);
        const cuisines = await restaurantService.getAllCuisines();
        setAvailableCuisines(cuisines);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching cuisines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update temp selection when props change
  useEffect(() => {
    setTempSelectedCuisines(selectedCuisines);
  }, [selectedCuisines]);

  const toggleCuisine = (cuisineId) => {
    setTempSelectedCuisines(prev => 
      prev.includes(cuisineId) 
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const handleApplyFilter = () => {
    onFilterChange(tempSelectedCuisines);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setTempSelectedCuisines([]);
    onFilterChange([]);
    setIsOpen(false);
  };

  const selectedCount = tempSelectedCuisines.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 font-medium text-sm
          ${selectedCount > 0 
            ? 'bg-orange-500 text-white border-orange-500 shadow-md hover:bg-orange-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
      >
        <Filter className="w-4 h-4" />
        <span>
          {selectedCount > 0 ? `${selectedCount} Cuisine${selectedCount > 1 ? 's' : ''}` : 'Filter by Cuisine'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filter by Cuisine</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cuisine List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading cuisines...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600 text-sm">
                {error}
              </div>
            ) : availableCuisines.length > 0 ? (
              <div className="p-2">
                {availableCuisines.map((cuisine) => {
                  const isSelected = tempSelectedCuisines.includes(cuisine.id);
                  return (
                    <button
                      key={cuisine.id}
                      onClick={() => toggleCuisine(cuisine.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-left
                        ${isSelected 
                          ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center
                        ${isSelected 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300'
                        }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium">{cuisine.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No cuisines available
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={handleClearFilter}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisineFilter;