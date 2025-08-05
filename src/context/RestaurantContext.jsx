import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  // Removed useMemo as frontend sorting is no longer needed
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

const DEFAULT_SORT_OPTION = 'name-asc'; // Default sort option

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(ERROR_CONTEXT_MISUSE);
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]); // Now directly holds sorted data from backend
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTermState] = useState('');
  const [sortOption, setSortOptionState] = useState(DEFAULT_SORT_OPTION);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: DEFAULT_ITEMS_PER_PAGE,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // fetchRestaurants now sends 'sort' parameter to the backend
  const fetchRestaurants = useCallback(async (filterParams = {}, page = 1, limit = DEFAULT_ITEMS_PER_PAGE, currentSortOption = sortOption) => {
    setLoading(true);
    setError(null);

    try {
      const requestParams = {
        ...filterParams,
        page,
        limit,
        sort: currentSortOption, // Include sort option for backend
      };

      const response = await restaurantService.getAllRestaurants(requestParams);

      if (response.data && response.pagination) {
        setRestaurants(response.data);
        setPagination(response.pagination);
      } else {
        // Fallback for old response format (just array) - though backend should now return pagination
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
  }, [sortOption]); // Depend on sortOption so it's always current

  // applyFilters now also passes the current sortOption
  const applyFilters = useCallback(async (newFilters, page = 1, limit = pagination.limit) => {
    setFilters(newFilters);
    await fetchRestaurants(newFilters, page, limit, sortOption);
  }, [fetchRestaurants, pagination.limit, sortOption]);

  // clearAllFilters now also passes the current sortOption
  const clearAllFilters = useCallback(async () => {
    setFilters(DEFAULT_FILTERS);
    await fetchRestaurants(DEFAULT_FILTERS, 1, pagination.limit, sortOption);
  }, [fetchRestaurants, pagination.limit, sortOption]);

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

  // Pagination handlers now also pass the current sortOption
  const goToPage = useCallback(async (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await fetchRestaurants(filters, page, pagination.limit, sortOption);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchRestaurants, filters, pagination.limit, pagination.totalPages, sortOption]);

  const changeItemsPerPage = useCallback(async (newLimit) => {
    await fetchRestaurants(filters, 1, newLimit, sortOption);
  }, [fetchRestaurants, filters, sortOption]);

  // setSearchTerm now triggers a fetch with the new search term and current sortOption
  const setSearchTerm = useCallback(async (newSearchTerm) => {
    setSearchTermState(newSearchTerm);
    const updatedFilters = { ...filters, name: newSearchTerm };
    setFilters(updatedFilters);
    await fetchRestaurants(updatedFilters, 1, pagination.limit, sortOption);
  }, [fetchRestaurants, filters, pagination.limit, sortOption]);

  // setSortOption now triggers a fetch with the new sort option and current filters
  const setSortOption = useCallback(async (newSortOption) => {
    setSortOptionState(newSortOption);
    // Trigger a new fetch with the updated sort option
    await fetchRestaurants(filters, pagination.currentPage, pagination.limit, newSortOption);
  }, [fetchRestaurants, filters, pagination.currentPage, pagination.limit]);

  // Initial data fetch on component mount, including initial sort option
  useEffect(() => {
    fetchRestaurants(filters, 1, DEFAULT_ITEMS_PER_PAGE, sortOption);
  }, [fetchRestaurants, filters, sortOption]); // Added filters and sortOption to deps for initial fetch

  const contextValue = {
    // Restaurant data
    restaurants, // Now directly from backend, already sorted
    selectedRestaurant,
    loading,
    error,

    // Filters
    filters,
    applyFilters,
    clearAllFilters,

    // Search and Sort
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,

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
