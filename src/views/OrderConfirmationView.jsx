import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import RatingCard from '../components/ui/RatingCard';
import { useOrders } from '../context/OrderContext'; 
import { useAlert } from '../context/AlertContext'; 

const OrderConfirmationView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { submitOrderRating } = useOrders();
  const { showAlert } = useAlert();
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  useEffect(() => {
    
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      navigate('/restaurants', { replace: true });
    }
  }, [location.state, navigate]);

  const handleRatingSubmit = useCallback(async (orderId, rating, comment) => {
    setIsRatingSubmitting(true);
    try {
      await submitOrderRating(orderId, rating, comment);
      showAlert('Rating submitted successfully!', 'success');
    } catch (error) {
      showAlert(error.message || 'Failed to submit rating.', 'error');
    } finally {
      setIsRatingSubmitting(false);
    }
  }, [submitOrderRating, showAlert]);
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading order details...</p>
      </div>
    );
  }

  const DeliveryTime = "30-45 min";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce-in" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your order has been successfully placed.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center border-b pb-2 border-gray-100">
            <span className="text-gray-600 font-medium">Order ID:</span>
            <span className="font-semibold text-gray-800 break-all">{
            `ORD-${order.orderId.substring(0, 8).toUpperCase()}` || 'N/A'
            }</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 border-gray-100">
            <span className="text-gray-600 font-medium">Customer Name:</span>
            <span className="font-semibold text-gray-800">{order.userName || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-start border-b pb-2 border-gray-100">
            <span className="text-gray-600 font-medium">Delivery Address:</span>
            <span className="font-semibold text-right text-gray-800">{order.userAddress || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 border-gray-100">
            <span className="text-gray-600 font-medium">Payment Method:</span>
            <span className="font-semibold text-gray-800 capitalize">{order.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 border-gray-100">
            <span className="text-gray-600 font-medium">Estimated Delivery:</span>
            <span className="font-semibold text-gray-800">{DeliveryTime}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-gray-800">Total Amount:</span>
            <span className="text-2xl font-extrabold text-amber-600">${parseFloat(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')} 
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            View My Orders
          </button>
        </div>
      </div>

      {order.orderId && (
        <RatingCard
          orderId={order.orderId}
          onRatingSubmit={handleRatingSubmit}
          isSubmitting={isRatingSubmitting}
        />
      )}
    </div>
  );
};

export default OrderConfirmationView;
