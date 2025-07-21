// services/restaurantService.js
import api from '../utils/api';

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await api.get('/api/restaurants');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch restaurants');
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch restaurant details');
    }
  },

  // Search restaurants
  searchRestaurants: async (query) => {
    try {
      const response = await api.get(`/restaurants/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search restaurants');
    }
  },

  // Get restaurant menu
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch menu');
    }
  },
  
  getRestaurantCuisines: async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/cuisines`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cuisines');
    }
  },

  getAllCuisines: async () => {
    try {
      const response = await api.get('/api/cuisines'); // Assuming this endpoint
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all cuisines');
    }
  },
};

