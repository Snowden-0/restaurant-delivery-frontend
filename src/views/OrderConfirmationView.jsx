import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck,
  ChefHat,
  Package,
  User,
  Receipt
} from 'lucide-react';
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
  const [hasRatedThisSession, setHasRatedThisSession] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      navigate('/restaurants', { replace: true });
    }
  }, [location.state, navigate]);

  // Simulate order progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep(2);
    }, 3000);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleRatingSubmit = useCallback(async (orderId, rating, comment) => {
    setIsRatingSubmitting(true);
    try {
      await submitOrderRating(orderId, rating, comment);
      showAlert('Rating submitted successfully!', 'success');
      setHasRatedThisSession(true);
    } catch (error) {
      showAlert(error.message || 'Failed to submit rating.', 'error');
    } finally {
      setIsRatingSubmitting(false);
    }
  }, [submitOrderRating, showAlert]);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  const DeliveryTime = "30-45 min";
  const estimatedDeliveryTime = new Date(Date.now() + 35 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Mock order items - replace with actual order items from your data
  const orderItems = order.items || [
    { name: "Margherita Pizza", quantity: 1, price: 12.99 },
    { name: "Caesar Salad", quantity: 1, price: 8.99 },
    { name: "Garlic Bread", quantity: 2, price: 4.99 }
  ];

  const orderSteps = [
    { 
      id: 1, 
      title: "Order Confirmed", 
      description: "We've received your order",
      icon: CheckCircle,
      completed: true 
    },
    { 
      id: 2, 
      title: "Preparing", 
      description: "Chef is preparing your meal",
      icon: ChefHat,
      completed: currentStep >= 2 
    },
    { 
      id: 3, 
      title: "Ready for Pickup", 
      description: "Order is ready for delivery",
      icon: Package,
      completed: currentStep >= 3 
    },
    { 
      id: 4, 
      title: "On the Way", 
      description: "Driver is heading to you",
      icon: Truck,
      completed: false 
    }
  ];

  // Thank you message component
  const ThankYouMessage = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 w-full border border-green-100">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <Heart className="w-16 h-16 text-green-500 animate-pulse" fill="currentColor" />
          <Star className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" fill="currentColor" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
        <p className="text-green-600 font-semibold mb-3">Your feedback has been submitted</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          We truly appreciate you taking the time to share your experience with us. 
          Your feedback helps us serve you better!
        </p>
        <div className="mt-4 flex space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with celebration animation */}
        <div className="text-center mb-8 pt-8 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-32 h-32 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <CheckCircle className="w-20 h-20 text-green-500 mb-4 mx-auto relative z-10 animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-xl">Your delicious meal is on its way</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
            <Clock className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-semibold">Estimated delivery: {estimatedDeliveryTime}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row xl:space-x-8 space-y-8 xl:space-y-0 items-start justify-center">
          
          {/* Left Column - Order Details */}
          <div className="w-full xl:w-2/3 space-y-6">
            
            {/* Order Progress Tracker */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-amber-600" />
                Order Progress
              </h2>
              <div className="space-y-4">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      } ${step.completed && step.id === currentStep ? 'animate-pulse' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className={`font-semibold ${step.completed ? 'text-green-700' : 'text-gray-500'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                      {index < orderSteps.length - 1 && (
                        <div className={`absolute ml-5 mt-12 w-0.5 h-8 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Receipt className="w-6 h-6 mr-2 text-amber-600" />
                Order Items
              </h2>
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <ChefHat className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Truck className="w-6 h-6 mr-2 text-amber-600" />
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                    <p className="text-gray-600 text-sm">{order.userAddress || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Customer</h3>
                    <p className="text-gray-600 text-sm">{order.userName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Contact</h3>
                    <p className="text-gray-600 text-sm">{order.userPhone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Delivery Time</h3>
                    <p className="text-gray-600 text-sm">{DeliveryTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Rating */}
          <div className="w-full xl:w-1/3 space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-amber-600" />
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold text-gray-800 font-mono">
                    {`ORD-${order.orderId.substring(0, 8).toUpperCase()}` || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {order.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-extrabold text-amber-600">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <button
                  onClick={() => navigate('/restaurants')}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Order Again
                </button>
                <button
                  onClick={() => navigate('/orders')} 
                  className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md border border-gray-200"
                >
                  View My Orders
                </button>
              </div>
            </div>

            {/* Rating Section */}
            {order.orderId && !hasRatedThisSession && (
              <RatingCard
                orderId={order.orderId}
                onRatingSubmit={handleRatingSubmit}
                isSubmitting={isRatingSubmitting}
              />
            )}
            
            {hasRatedThisSession && <ThankYouMessage />}

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Support: +1 (555) 999-FOOD</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationView;