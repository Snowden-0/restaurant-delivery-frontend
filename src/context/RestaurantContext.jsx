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

const DEFAULT_FILTERS = {
  cuisines: [],
  minRating: null,
  isOpen: null,
  name: '' 
};

const DEFAULT_SORT_OPTION = 'name-asc'; 

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

  const fetchRestaurants = useCallback(async (filterParams = {}, page = 1, limit = DEFAULT_ITEMS_PER_PAGE) => {
    setLoading(true);
    setError(null);

    try {
      const requestParams = {
      
        name: filterParams.name || '', // Send name for backend search
        cuisines: filterParams.cuisines || [],
        isOpen: filterParams.isOpen,
        minRating: filterParams.minRating,
        page,
        limit
      };

      const response = await restaurantService.getAllRestaurants(requestParams);

      if (response.data && response.pagination) {
        setRestaurants(response.data);
        setPagination(response.pagination);
      } else {
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
    // When filters change, re-fetch from backend with updated filters
    // The search term (filters.name) is part of the filters object now
    await fetchRestaurants(newFilters, page, limit);
  }, [fetchRestaurants, pagination.limit]);

  const clearAllFilters = useCallback(async () => {
    setFilters(DEFAULT_FILTERS);
    // Clear filters and re-fetch from backend
    await fetchRestaurants(DEFAULT_FILTERS, 1, pagination.limit);
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
      // Go to page, re-fetch with current filters (including search term)
      await fetchRestaurants(filters, page, pagination.limit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchRestaurants, filters, pagination.limit, pagination.totalPages]);

  const changeItemsPerPage = useCallback(async (newLimit) => {
    // Change limit, re-fetch with current filters (including search term)
    await fetchRestaurants(filters, 1, newLimit);
  }, [fetchRestaurants, filters]);

  // Function to update search term and trigger refetch
  // The search term is now part of the `filters.name`
  const setSearchTerm = useCallback(async (newSearchTerm) => {
    setSearchTermState(newSearchTerm); // Update local state for input control
    const updatedFilters = { ...filters, name: newSearchTerm };
    setFilters(updatedFilters); // Update filters state
    await fetchRestaurants(updatedFilters, 1, pagination.limit); // Trigger fetch
  }, [fetchRestaurants, filters, pagination.limit]);

  // Function to update sort option (frontend only)
  const setSortOption = useCallback((newSortOption) => {
    setSortOptionState(newSortOption);
    // No fetch call here, as sorting is applied to existing 'restaurants' data
  }, []);

  // Use useMemo to sort restaurants whenever 'restaurants' or 'sortOption' changes
  const sortedRestaurants = useMemo(() => {
    if (!restaurants || restaurants.length === 0) {
      return [];
    }

    // Create a mutable copy to sort
    const sortableRestaurants = [...restaurants];

    switch (sortOption) {
      case 'name-asc':
        return sortableRestaurants.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortableRestaurants.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating-desc':
        // Use 'average_rating' and handle null/undefined by treating as 0
        return sortableRestaurants.sort((a, b) => (parseFloat(b.average_rating) || 0) - (parseFloat(a.average_rating) || 0));
      case 'rating-asc':
        // Use 'average_rating' and handle null/undefined by treating as 0
        return sortableRestaurants.sort((a, b) => (parseFloat(a.average_rating) || 0) - (parseFloat(b.average_rating) || 0));
      default:
        return sortableRestaurants; // Return as is if no valid sort option
    }
  }, [restaurants, sortOption]); // Dependencies for memoization

  // Initialize data on component mount
  useEffect(() => {
    fetchRestaurants(filters, 1, DEFAULT_ITEMS_PER_PAGE);
  }, [fetchRestaurants]); // Only re-run if fetchRestaurants changes

  const contextValue = {
    // Restaurant data
    restaurants: sortedRestaurants, // Expose the sorted list
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
    fetchRestaurants, // This still exists if other parts of the app need to trigger a raw fetch
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