import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProfile } from '../services/userServices';
import { createOrder } from '../services/orderServices';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

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
  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        setError(AUTH_ERROR);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      try {
        const profileData = await fetchProfile();
        setUser(profileData);
      } catch (err) {
        setError(err.message || FETCH_PROFILE_ERROR);
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    loadProfile();
  }, [isAuthenticated, navigate, showAlert]);

  useEffect(() => {
    if (cartItems.length === 0 && !loading && isAuthenticated && !orderPlaced) {
      navigate('/restaurants', { replace: true });
    }
  }, [cartItems, loading, isAuthenticated, navigate, orderPlaced]);


  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) {
      setError(PLACE_ORDER_ERROR);
      return;
    }

    setLoading(true);

    const restaurantId = cartItems[0]?.restaurantId;
    if (!restaurantId) {
        setError(FETCH_RESTAURANT_ERROR);
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
      setOrderPlaced(true); // Set the flag to true indicating successful order placement

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
      setError(err.message || UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center p-8">Loading user details...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <p>{user.name}</p>
        <p>{user.address}</p>
        <p>{user.phone_number}</p>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="cash_on_delivery">Cash on Delivery</option>
        </select>
      </div>
      <button 
        onClick={handlePlaceOrder}
        disabled={loading || cartItems.length === 0}
        className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center"
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 01 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Place Order'
        )}
      </button>
    </div>
  );
};

export default CheckoutPageView;
