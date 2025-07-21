// context/RestaurantContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { restaurantService } from '../services/restaurantService';

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  // 1. Add state for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // 2. Add state for the filtered restaurants
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
      // Also set the initial filtered list to all restaurants
      setFilteredRestaurants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRestaurantById = useCallback(async (id) => {
    // ... (no changes needed here)
  }, []);

  // 3. Add a useEffect to filter restaurants when searchTerm or the main list changes
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]); // This effect runs whenever searchTerm or restaurants change

  // Load restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const value = {
    restaurants: filteredRestaurants, // 4. Expose the filtered list
    selectedRestaurant,
    loading,
    error,
    fetchRestaurants,
    getRestaurantById,
    setSelectedRestaurant,
    searchTerm,       // 5. Expose the search term and its setter
    setSearchTerm,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};