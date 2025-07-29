import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProfile } from '../services/userServices';
import { createOrder } from '../services/orderServices';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { ClipLoader } from 'react-spinners';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  User, 
  Phone, 
  ArrowRight,
  Clock,
  Utensils,
  Truck
} from 'lucide-react';

const PLACE_ORDER_ERROR = 'Cannot place order. Ensure you are logged in and your cart is not empty.';
const AUTH_ERROR = 'You must be logged in to place an order.';
const FETCH_PROFILE_ERROR = 'Cannot fetch profile for the user';
const FETCH_RESTAURANT_ERROR = 'Could not determine the restaurant for the order.';
const UNEXPECTED_ERROR = 'An unexpected error occurred.'

const CheckoutPageView = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        showAlert(AUTH_ERROR, 'error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      try {
        setUserLoading(true);
        const profileData = await fetchProfile();
        setUser(profileData);
      } catch (err) {
        showAlert(err.message || FETCH_PROFILE_ERROR, 'error');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setUserLoading(false);
      }
    };
    loadProfile();
  }, [isAuthenticated, navigate, showAlert]);

  useEffect(() => {
    if (cartItems.length === 0 && !loading && isAuthenticated && !orderPlaced && !userLoading) {
      navigate('/restaurants', { replace: true });
    }
  }, [cartItems, loading, isAuthenticated, navigate, orderPlaced, userLoading]);

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) {
      showAlert(PLACE_ORDER_ERROR, 'error');
      return;
    }

    setLoading(true);

    const restaurantId = cartItems[0]?.restaurantId;
    if (!restaurantId) {
        showAlert(FETCH_RESTAURANT_ERROR, 'error');
        setLoading(false);
        return;
    }

    const orderData = {
      restaurantId,
      totalAmount: totalPrice,
      paymentMethod,
      items: cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
    };

    try {
      const response = await createOrder(orderData);
      clearCart(); 
      showAlert('Order placed successfully!', 'success'); 
      setOrderPlaced(true);

      navigate('/order-confirmation', {
        state: {
          order: {
            orderId: 'ORD-' + response.order.id.substring(0, 8).toUpperCase(),
            userName: user.name,
            userAddress: user.address, 
            userPhoneNumber: user.phone_number, 
            totalAmount: totalPrice,
            paymentMethod: paymentMethod,
            items: cartItems,
          }
        }
      });
    } catch (err) {
      showAlert(err.message || UNEXPECTED_ERROR, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-orange-100">
              <ClipLoader 
                color="#EA580C" 
                size={60} 
                loading={userLoading}
                cssOverride={{
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <p className="mt-6 text-xl font-semibold text-gray-700 text-center">Loading your details</p>
              <p className="mt-2 text-sm text-gray-500 text-center">Setting up your checkout experience...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Review your items and confirm delivery details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
              
              {/* Order Items */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
                  Your Order
                </h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{item.quantity}x</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price} each</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-orange-600" />
                  Delivery Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{user.address}</p>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{user.phone_number}</p>
                      <p className="text-sm text-gray-500">Contact Number</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-orange-600 mr-3"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Secure online payment</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-orange-600 mr-3"
                    />
                    <Truck className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                <div className="bg-orange-600 p-4">
                  <h3 className="text-lg font-semibold text-white">Order Summary</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="px-6 pb-4">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-900">Estimated Delivery</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">25-35 mins</p>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="p-6 pt-0">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <ClipLoader 
                          color="#ffffff" 
                          size={20} 
                          loading={loading}
                        />
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageView;