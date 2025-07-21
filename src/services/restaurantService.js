// services/restaurantService.js
import api from '../utils/api';

// Error message constants
const ERROR_FETCH_RESTAURANTS = 'Failed to fetch restaurants';
const ERROR_FETCH_RESTAURANT_DETAILS = 'Failed to fetch restaurant details and menu';
const ERROR_SEARCH_RESTAURANTS = 'Failed to search restaurants';
const ERROR_FETCH_MENU = 'Failed to fetch menu';
const ERROR_FETCH_CUISINES = 'Failed to fetch cuisines';
const ERROR_FETCH_ALL_CUISINES = 'Failed to fetch all cuisines';

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await api.get('/api/restaurants');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANTS);
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_FETCH_RESTAURANT_DETAILS);
    }
  },

  // Search restaurants
  searchRestaurants: async (query) => {
    try {
      const response = await api.get(`/restaurants/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_SEARCH_RESTAURANTS);
    }
  },

  // Get restaurant menu
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_FETCH_MENU);
    }
  },
  
  getRestaurantCuisines: async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/cuisines`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_FETCH_CUISINES);
    }
  },

  getAllCuisines: async () => {
    try {
      const response = await api.get('/api/cuisines');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || ERROR_FETCH_ALL_CUISINES);
    }
  },
};