import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { restaurantService } from '../services/restaurantService';

const ERROR_CONTEXT_MISUSE = 'useRestaurant must be used within RestaurantProvider';
const ERROR_FETCH_RESTAURANTS = 'Failed to fetch restaurants';
const ERROR_FETCH_DETAILS = 'Failed to fetch restaurant details and menu';

const DEFAULT_ITEMS_PER_PAGE = 9;

const DEFAULT_FILTERS = {
  cuisines: [],
  minRating: null,
  isOpen: null,
  name: ''
};

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
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  
  // Backend pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: DEFAULT_ITEMS_PER_PAGE,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchRestaurants = useCallback(async (filterParams = {}, page = 1, limit = DEFAULT_ITEMS_PER_PAGE) => {
    setLoading(true);
    setError(null);
    
    try {
      const requestParams = {
        ...filterParams,
        page,
        limit
      };

      const response = await restaurantService.getAllRestaurants(requestParams);
      
      // Handle backend response structure
      if (response.data && response.pagination) {
        // Backend returns { data: [...], pagination: {...} }
        setRestaurants(response.data);
        setPagination(response.pagination);
      } else {
        // Fallback for old response format (just array)
        setRestaurants(response);
        setPagination({
          currentPage: page,
          totalPages: 1,
          totalCount: response.length,
          limit,
          hasNextPage: false,
          hasPreviousPage: false
        });
      }
    } catch (err) {
      setError(err.message || ERROR_FETCH_RESTAURANTS);
      setRestaurants([]);
      setPagination({
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit,
        hasNextPage: false,
        hasPreviousPage: false
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (newFilters, page = 1, limit = pagination.limit) => {
    setFilters(newFilters);
    
    const filterParams = {};
    if (newFilters.name) filterParams.name = newFilters.name;
    if (newFilters.cuisines.length > 0) filterParams.cuisines = newFilters.cuisines;
    if (newFilters.isOpen !== null) filterParams.isOpen = newFilters.isOpen;
    if (newFilters.minRating !== null) filterParams.minRating = newFilters.minRating;
    
    await fetchRestaurants(filterParams, page, limit);
  }, [fetchRestaurants, pagination.limit]);

  const clearAllFilters = useCallback(async () => {
    setFilters(DEFAULT_FILTERS);
    await fetchRestaurants({}, 1, pagination.limit);
  }, [fetchRestaurants, pagination.limit]);

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

  // Pagination handlers
  const goToPage = useCallback(async (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      const filterParams = {};
      if (filters.name) filterParams.name = filters.name;
      if (filters.cuisines.length > 0) filterParams.cuisines = filters.cuisines;
      if (filters.isOpen !== null) filterParams.isOpen = filters.isOpen;
      if (filters.minRating !== null) filterParams.minRating = filters.minRating;
      
      await fetchRestaurants(filterParams, page, pagination.limit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchRestaurants, filters, pagination.limit, pagination.totalPages]);

  const changeItemsPerPage = useCallback(async (newLimit) => {
    const filterParams = {};
    if (filters.name) filterParams.name = filters.name;
    if (filters.cuisines.length > 0) filterParams.cuisines = filters.cuisines;
    if (filters.isOpen !== null) filterParams.isOpen = filters.isOpen;
    if (filters.minRating !== null) filterParams.minRating = filters.minRating;
    
    await fetchRestaurants(filterParams, 1, newLimit);
  }, [fetchRestaurants, filters]);

  // Initialize data
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const contextValue = {
    // Restaurant data
    restaurants,
    selectedRestaurant,
    loading,
    error,
    
    // Filters
    filters,
    applyFilters,
    clearAllFilters,
    
    // Backend pagination
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalCount: pagination.totalCount,
    limit: pagination.limit,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    
    // Actions
    fetchRestaurants,
    getRestaurantById,
    setSelectedRestaurant,
    goToPage,
    changeItemsPerPage,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};