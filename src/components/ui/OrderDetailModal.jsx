import React, { useState } from 'react';
import { X, Calendar, Hash, CreditCard, ShoppingCart, Home, Clock, Star } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { formatCurrency, formatDate, formatOrderId } from '../../utils/formatters';
import RatingCard from './RatingCard';
import { useOrders } from '../../context/OrderContext'; 
import { useAlert } from '../../context/AlertContext'; 

const OrderDetailModal = ({ order, onClose, isLoading }) => {
    const { submitOrderRating, fetchOrderDetails } = useOrders(); // Add fetchOrderDetails
    const { showAlert } = useAlert();
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

    if (!order && !isLoading) return null;

    const renderSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
            <div className="mt-6 border-t pt-4">
                 <div className="h-5 bg-gray-300 rounded w-1/4 mb-4"></div>
                 <div className="h-10 bg-gray-300 rounded w-full mb-2"></div>
                 <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    );

    const fullFormatDate = (dateString) => {
        return formatDate(dateString, { hour: '2-digit', minute: '2-digit' });
    };

    
    const handleRatingSubmit = React.useCallback(async (orderId, rating, comment) => {
        setIsRatingSubmitting(true);
        try {
            await submitOrderRating(orderId, rating, comment);
            await fetchOrderDetails(orderId);
            showAlert('Rating submitted successfully!', 'success');
        } catch (error) {
            showAlert(error.message || 'Failed to submit rating.', 'error');
        } finally {
            setIsRatingSubmitting(false);
        }
    }, [submitOrderRating, fetchOrderDetails, showAlert]);

    return (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 sticky top-0 bg-white border-b z-10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <ClipLoader
                                color="#4F46E5"
                                size={50}
                                loading={isLoading}
                                cssOverride={{
                                    display: "block",
                                    margin: "0 auto",
                                }}
                            />
                            <p className="mt-4 text-gray-600 text-lg">Loading order details...</p>
                        </div>
                    ) : (
                         <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-700">{order.restaurant_name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center"><Home size={14} className="mr-2" />{order.restaurant_address}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p className="flex justify-between text-sm">
                                        <span className="font-semibold text-gray-600 flex items-center"><Hash size={14} className="mr-2"/>Order ID</span>
                                        <span className="font-mono text-gray-800">{formatOrderId(order.id)}</span>
                                    </p>
                                    <p className="flex justify-between text-sm">
                                        <span className="font-semibold text-gray-600 flex items-center"><Calendar size={14} className="mr-2"/>Date</span>
                                        <span className="text-gray-800">{fullFormatDate(order.created_at)}</span>
                                    </p>
                                    <p className="flex justify-between text-sm">
                                        <span className="font-semibold text-gray-600 flex items-center"><Clock size={14} className="mr-2"/>Status</span>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 capitalize">{order.status}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><ShoppingCart size={18} className="mr-2"/>Items</h3>
                                <div className="border rounded-lg">
                                    <ul className="divide-y">
                                        {order.items?.map((item, index) => (
                                            <li key={index} className="flex justify-between items-center p-3">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{item.menu_item_name}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="text-gray-700 font-medium">{formatCurrency(item.menu_item_price * item.quantity)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><CreditCard size={18} className="mr-2"/>Payment</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <p className="flex justify-between text-sm">
                                            <span className="font-semibold text-gray-600">Method</span>
                                            <span className="text-gray-800 capitalize">{order.payment_method}</span>
                                        </p>
                                        <p className="flex justify-between text-sm">
                                            <span className="font-semibold text-gray-600">Status</span>
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">{order.payment_status}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                     <div className="bg-gray-800 text-white p-4 rounded-lg text-right">
                                         <p className="text-sm text-gray-300">Total Amount</p>
                                         <p className="text-3xl font-bold">{formatCurrency(order.total_amount)}</p>
                                     </div>
                                </div>
                            </div>

                            {/* Rating Section with Loading State */}
                            <div className="mt-6 border-t pt-6">
                                {isRatingSubmitting ? (
                                    // Show loading state during rating submission
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <ClipLoader
                                            color="#F59E0B"
                                            size={40}
                                            loading={isRatingSubmitting}
                                            cssOverride={{
                                                display: "block",
                                                margin: "0 auto",
                                            }}
                                        />
                                        <p className="mt-4 text-gray-600">Submitting your rating...</p>
                                    </div>
                                ) : (
                                    // Show rating content when not submitting
                                    <>
                                        {(order.order_rating !== null && order.order_rating !== undefined) || order.order_comment ? (
                                            <>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                    <Star size={18} className="mr-2"/>Your Rating
                                                </h3>
                                                <div className="bg-amber-50 p-4 rounded-lg space-y-2">
                                                    {(order.order_rating !== null && order.order_rating !== undefined) && (
                                                        <div className="flex items-center">
                                                            <span className="font-semibold text-gray-700 mr-2">Rating:</span>
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map((starValue) => (
                                                                    <Star
                                                                        key={starValue}
                                                                        size={20}
                                                                        fill={starValue <= order.order_rating ? '#F59E0B' : 'none'}
                                                                        stroke={starValue <= order.order_rating ? '#F59E0B' : '#D1D5DB'}
                                                                        className="text-amber-500"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {order.order_comment && (
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Comment:</span> {order.order_comment}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <RatingCard
                                                orderId={order.id}
                                                onRatingSubmit={handleRatingSubmit}
                                                existingRating={order.order_rating}
                                                existingComment={order.order_comment}
                                                isSubmitting={isRatingSubmitting}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;