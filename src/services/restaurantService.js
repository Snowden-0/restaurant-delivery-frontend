import api from '../utils/api';

const ERROR_FETCH_RESTAURANTS = 'Failed to fetch restaurants';
const ERROR_FETCH_RESTAURANT_DETAILS = 'Failed to fetch restaurant details and menu';
const ERROR_SEARCH_RESTAURANTS = 'Failed to search restaurants';
const ERROR_FETCH_MENU = 'Failed to fetch menu';
const ERROR_FETCH_CUISINES = 'Failed to fetch cuisines';
const ERROR_FETCH_ALL_CUISINES = 'Failed to fetch all cuisines';

export const restaurantService = {
  getAllRestaurants: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.name) {
        params.append('name', filters.name);
      }

      if (filters.cuisines && filters.cuisines.length > 0) {
        params.append('cuisines', filters.cuisines.join(','));
      }

      if (filters.isOpen !== null && filters.isOpen !== undefined) {
        params.append('isOpen', filters.isOpen.toString());
      }

      if (filters.minRating !== null && filters.minRating !== undefined) {
        params.append('minRating', filters.minRating.toString());
      }

      if (filters.page) {
        params.append('page', filters.page.toString());
      }

      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      // Add the sort parameter to the URL
      if (filters.sort) {
        params.append('sort', filters.sort);
      }

      const queryString = params.toString();
      const url = queryString ? `/api/restaurants?${queryString}` : '/api/restaurants';

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants with filters:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANTS);
    }
  },

  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANT_DETAILS);
    }
  },

  searchRestaurants: async (query) => {
    try {
      const response = await api.get(`/api/restaurants/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw new Error(error.response?.data?.message || ERROR_SEARCH_RESTAURANTS);
    }
  },

  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_MENU);
    }
  },

  getRestaurantCuisines: async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/cuisines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant cuisines:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_CUISINES);
    }
  },

  getAllCuisines: async () => {
    try {
      const response = await api.get('/api/restaurants/cuisines');
      return response.data;
    } catch (error) {
      console.error('Error fetching all cuisines:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_ALL_CUISINES);
    }
  },

  getRestaurantsByCuisine: async (cuisineId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/restaurants?cuisines=${cuisineId}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants by cuisine:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANTS);
    }
  },

  getRestaurantsByRating: async (minRating, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/restaurants?minRating=${minRating}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants by rating:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANTS);
    }
  },

  getOpenRestaurants: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/restaurants?isOpen=true&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching open restaurants:', error);
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANTS);
    }
  },

  searchRestaurantsAdvanced: async (searchParams) => {
    try {
      const {
        name,
        cuisines = [],
        minRating,
        isOpen,
        page = 1,
        limit = 10,
        sort // Add sort parameter here too for advanced search
      } = searchParams;

      const params = new URLSearchParams();

      if (name) params.append('name', name);
      if (cuisines.length > 0) params.append('cuisines', cuisines.join(','));
      if (minRating !== null && minRating !== undefined) params.append('minRating', minRating);
      if (isOpen !== null && isOpen !== undefined) params.append('isOpen', isOpen);
      if (sort) params.append('sort', sort); // Append sort for advanced search
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/api/restaurants?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in advanced restaurant search:', error);
      throw new Error(error.response?.data?.message || ERROR_SEARCH_RESTAURANTS);
    }
  }
};