import api from '../utils/api';

const ERROR_CREATE_RATING = 'Failed to create rating, Please try again.'

export const createRating = async (orderId, rating, comment) => {
  try {
    const response = await api.post(`/api/rating/${orderId}/rating`, { rating, comment });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || ERROR_CREATE_RATING);
  }
};