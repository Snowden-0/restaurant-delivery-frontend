// context/RestaurantContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { restaurantService } from '../services/restaurantService';

// Error message constants
const ERROR_CONTEXT_MISUSE = 'useRestaurant must be used within RestaurantProvider';
const ERROR_FETCH_RESTAURANTS = 'Failed to fetch restaurants';
const ERROR_FETCH_DETAILS = 'Failed to fetch restaurant details and menu';

// Create context
const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(ERROR_CONTEXT_MISUSE);
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  // State declarations
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data fetching functions
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (err) {
      setError(err.message || ERROR_FETCH_RESTAURANTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRestaurantById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.getRestaurantById(id);
      setSelectedRestaurant(data);
    } catch (err) {
      setError(err.message || ERROR_FETCH_DETAILS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter effect
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
  }, [searchTerm, restaurants]);

  // Initial data load
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Context value
  const contextValue = {
    restaurants: filteredRestaurants,
    selectedRestaurant,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchRestaurants,
    getRestaurantById,
    setSelectedRestaurant,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};