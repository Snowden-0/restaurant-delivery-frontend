import React, { useEffect, useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Calendar, Tag } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import OrderDetailModal from '../components/ui/OrderDetailModal';
import { formatCurrency, formatDate, formatOrderId } from '../utils/formatters';

const OrderCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <div className="h-4 bg-gray-300 rounded w-40"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);


const OrdersView = () => {
    const { orders, fetchOrders, isLoading, selectedOrder, fetchOrderDetails, clearSelectedOrder, isDetailLoading } = useOrders();
    const { isAuthenticated } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedOrderId, setClickedOrderId] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);
    
    const handleOrderClick = async (orderId) => {
        setClickedOrderId(orderId);
        setIsModalOpen(true);
        await fetchOrderDetails(orderId);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setClickedOrderId(null);
        clearSelectedOrder();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
                    <p className="mt-2 text-lg text-gray-600">Review your past orders and check their status.</p>
                </header>

                <div className="space-y-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} onClick={() => handleOrderClick(order.id)}
                                 className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-500 transition-all duration-300 cursor-pointer relative">
                                {clickedOrderId === order.id && isDetailLoading && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center">
                                            <ClipLoader 
                                                color="#4F46E5" 
                                                size={30} 
                                                loading={true}
                                                cssOverride={{
                                                    display: "block",
                                                    margin: "0 auto",
                                                }}
                                            />
                                            <p className="mt-2 text-sm text-gray-600">Loading...</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="mb-4 sm:mb-0">
                                        <h2 className="text-xl font-bold text-gray-800">{order.restaurant_name}</h2>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <span className="flex items-center mr-4"><Tag size={14} className="mr-1.5"/>ID: {formatOrderId(order.id)}</span>
                                            <span className="flex items-center"><Calendar size={14} className="mr-1.5"/>{formatDate(order.created_at)}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-semibold text-gray-900">{formatCurrency(order.total_amount)}</span>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>{order.status}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-sm text-indigo-600 font-semibold">View Details</span>
                                    <ChevronRight size={20} className="text-indigo-600" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
                            <ShoppingBag size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">No Orders Yet</h3>
                            <p className="mt-2 text-gray-500">You haven't placed any orders. Let's change that!</p>
                            <Link to="/restaurants" className="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                                Browse Restaurants
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            
            {isModalOpen && (
                <OrderDetailModal 
                    order={selectedOrder} 
                    onClose={handleCloseModal}
                    isLoading={isDetailLoading}
                />
            )}
        </div>
    );
};

export default OrdersView;