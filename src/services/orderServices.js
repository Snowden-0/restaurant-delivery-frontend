import api from '../utils/api'; 

const ERROR_CREATE_ORDER = 'Failed to create the order. Please try again.';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || ERROR_CREATE_ORDER);
  }
};