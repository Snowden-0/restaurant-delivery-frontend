import React, { createContext, useState, useContext, useCallback } from 'react';
import { getOrdersByUserId, getOrderDetailById } from '../services/orderServices';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

const FETCH_ORDER_ERROR = 'Failed to fetch orders.' ;
const FETCH_ORDER_DETAIL_ERROR = 'Failed to fetch order details.';

const OrderContext = createContext(null);

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const { user } = useAuth();
    const { showAlert } = useAlert();

    const fetchOrders = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        try {
            const userOrders = await getOrdersByUserId(user.id);
            setOrders(userOrders);
        } catch (error) {
            showAlert(error.message || FETCH_ORDER_ERROR, 'error');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, showAlert]);

    const fetchOrderDetails = useCallback(async (orderId) => {
        setIsDetailLoading(true);
        try {
            const orderDetails = await getOrderDetailById(orderId);
            setSelectedOrder(orderDetails);
            return orderDetails;
        } catch (error) {
            showAlert(error.message || FETCH_ORDER_DETAIL_ERROR, 'error');
            setSelectedOrder(null);
        } finally {
            setIsDetailLoading(false);
        }
    }, [showAlert]);
    
    const clearSelectedOrder = () => {
        setSelectedOrder(null);
    };

    const value = {
        orders,
        selectedOrder,
        isLoading,
        isDetailLoading,
        fetchOrders,
        fetchOrderDetails,
        clearSelectedOrder,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};