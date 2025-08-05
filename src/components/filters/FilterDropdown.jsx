import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const FilterDropdown = ({ 
  title, 
  children, 
  isOpen, 
  onToggle, 
  hasActiveFilters = false,
  className = "" 
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200
          ${hasActiveFilters 
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        `}
      >
        <span>{title}</span>
        {hasActiveFilters && (
          <span className="bg-blue-500 text-white text-xs rounded-full h-2 w-2"></span>
        )}
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;