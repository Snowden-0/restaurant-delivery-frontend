// context/RestaurantContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
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
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Wrap fetchRestaurants in useCallback
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function will never be recreated

  // 3. Wrap getRestaurantById in useCallback
  const getRestaurantById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      setSelectedRestaurant(restaurant);
      return restaurant;
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurant details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array here as well

  // Load restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]); // Now this dependency is stable

  const value = {
    restaurants,
    selectedRestaurant,
    loading,
    error,
    fetchRestaurants,
    getRestaurantById,
    setSelectedRestaurant
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};