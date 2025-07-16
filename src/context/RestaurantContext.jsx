// context/RestaurantContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Fetch all restaurants
  const fetchRestaurants = async () => {
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
  };

  // Get restaurant by ID
  const getRestaurantById = async (id) => {
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
  };

  // Load restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

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