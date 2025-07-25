import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProfile } from '../services/userServices'; // To get user info
import { createOrder } from '../services/orderServices'; // Our new service


const CheckoutPageView = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile();
        setUser(profileData);
      } catch (err) {
        setError('You must be logged in to place an order.');
        // Redirect to login if fetching profile fails
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    loadProfile();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!user || Object.keys(cartItems).length === 0) {
      setError('Cannot place order. Ensure you are logged in and your cart is not empty.');
      return;
    }

    setLoading(true);
    setError('');

    // Assuming all items in the cart are from the same restaurant.
    // In a real app, you might need to enforce this or handle multiple orders.
    const restaurantId = Object.values(cartItems)[0]?.restaurantId;
    if (!restaurantId) {
        setError('Could not determine the restaurant for the order.');
        setLoading(false);
        return;
    }


    // Prepare the data payload for the backend
    const orderData = {
      restaurantId,
      totalAmount: totalPrice,
      paymentMethod,
      items: Object.values(cartItems).map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price // Sending price for potential backend validation
      })),
    };
    console.log(orderData)

    try {
      await createOrder(orderData);
      // If successful:
      alert('Order placed successfully!'); // Replace with a proper success modal/toast
      clearCart();
      navigate('/my-orders'); // Navigate to an order history page
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
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
        {Object.values(cartItems).map(item => (
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
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button 
        onClick={handlePlaceOrder}
        disabled={loading || Object.keys(cartItems).length === 0}
        className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center"
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Place Order'
        )}
      </button>
    </div>
  );
};

export default CheckoutPageView;