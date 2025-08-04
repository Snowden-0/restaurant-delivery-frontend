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
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState('name-asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const fetchRestaurants = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.getAllRestaurants(filterParams);
      setRestaurants(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || ERROR_FETCH_RESTAURANTS);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    
    const filterParams = {};
    if (newFilters.name) filterParams.name = newFilters.name;
    if (newFilters.cuisines.length > 0) filterParams.cuisines = newFilters.cuisines;
    if (newFilters.isOpen !== null) filterParams.isOpen = newFilters.isOpen;
    if (newFilters.minRating !== null) filterParams.minRating = newFilters.minRating;
    
    await fetchRestaurants(filterParams);
  }, [fetchRestaurants]);

  const clearAllFilters = useCallback(async () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    await fetchRestaurants({});
  }, [fetchRestaurants]);

  const sortRestaurants = useCallback((restaurants, sortBy) => {
    const sorted = [...restaurants];
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating-desc':
        return sorted.sort((a, b) => {
          const ratingA = a.average_rating || 0;
          const ratingB = b.average_rating || 0;
          return ratingB - ratingA;
        });
      case 'rating-asc':
        return sorted.sort((a, b) => {
          const ratingA = a.average_rating || 0;
          const ratingB = b.average_rating || 0;
          return ratingA - ratingB;
        });
      default:
        return sorted;
    }
  }, []);

  useEffect(() => {
    const sorted = sortRestaurants(restaurants, sortOption);
    setSortedRestaurants(sorted);
  }, [restaurants, sortOption, sortRestaurants]);

  const searchFilteredRestaurants = useMemo(() => {
    if (!searchTerm) return sortedRestaurants;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    return sortedRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(lowercasedTerm) ||
      restaurant.description?.toLowerCase().includes(lowercasedTerm) ||
      restaurant.address?.toLowerCase().includes(lowercasedTerm)
    );
  }, [sortedRestaurants, searchTerm]);

  const paginationData = useMemo(() => {
    const totalItems = searchFilteredRestaurants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRestaurants = searchFilteredRestaurants.slice(startIndex, endIndex);

    return {
      paginatedRestaurants,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [searchFilteredRestaurants, currentPage, itemsPerPage]);

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

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const contextValue = {
    // Restaurant data
    restaurants: searchFilteredRestaurants,
    selectedRestaurant,
    loading,
    error,
    
    // Search
    searchTerm,
    setSearchTerm: handleSearchChange,
    
    // Filters and sorting
    filters,
    sortOption,
    applyFilters,
    clearAllFilters,
    setSortOption: handleSortChange,
    
    paginatedRestaurants: paginationData.paginatedRestaurants,
    currentPage,
    itemsPerPage,
    totalItems: paginationData.totalItems,
    totalPages: paginationData.totalPages,
    hasNextPage: paginationData.hasNextPage,
    hasPreviousPage: paginationData.hasPreviousPage,
    
    fetchRestaurants,
    getRestaurantById,
    setSelectedRestaurant,
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