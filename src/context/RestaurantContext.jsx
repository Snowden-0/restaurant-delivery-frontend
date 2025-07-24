import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { restaurantService } from '../services/restaurantService';

const ERROR_CONTEXT_MISUSE = 'useRestaurant must be used within RestaurantProvider';
const ERROR_FETCH_RESTAURANTS = 'Failed to fetch restaurants';
const ERROR_FETCH_DETAILS = 'Failed to fetch restaurant details and menu';

const DEFAULT_ITEMS_PER_PAGE = 9; 

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(ERROR_CONTEXT_MISUSE);
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
      setCurrentPage(1);
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

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(lowercasedTerm) ||
        restaurant.cuisine?.toLowerCase().includes(lowercasedTerm) ||
        restaurant.location?.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredRestaurants(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, restaurants]);

  const paginationData = useMemo(() => {
    const totalItems = filteredRestaurants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

    return {
      paginatedRestaurants,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [filteredRestaurants, currentPage, itemsPerPage]);

  // Pagination handlers
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [paginationData.totalPages]);

  const goToNextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, paginationData.hasNextPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, paginationData.hasPreviousPage, goToPage]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

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
    
    paginatedRestaurants: paginationData.paginatedRestaurants,
    currentPage,
    itemsPerPage,
    totalItems: paginationData.totalItems,
    totalPages: paginationData.totalPages,
    hasNextPage: paginationData.hasNextPage,
    hasPreviousPage: paginationData.hasPreviousPage,
    
    // Pagination methods
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeItemsPerPage,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};