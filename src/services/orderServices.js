import api from '../utils/api'; 

const ERROR_CREATE_ORDER = 'Failed to create the order. Please try again.';
const ERROR_FETCH_ORDERS = 'Failed to fetch your orders. Please try again.';
const ERROR_FETCH_ORDER_DETAIL = 'Failed to fetch order details. Please try again.';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || ERROR_CREATE_ORDER);
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data.orders;
  } catch (error) {
    throw new Error(error.response?.data?.message || ERROR_FETCH_ORDERS);
  }
};
export const getOrderDetailById = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data.order;
  } catch (error) {
    throw new Error(error.response?.data?.message || ERROR_FETCH_ORDER_DETAIL);
  }
};