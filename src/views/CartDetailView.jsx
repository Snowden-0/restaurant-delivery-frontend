// CartDetailsView.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Adjust path as needed
import { useRestaurant } from '../context/RestaurantContext'; // Adjust path as needed
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import {
  ArrowLeft,
  ShoppingCart,
  DollarSign,
  Package,
  Store,
  MapPin,
  Clock,
  Tag,
  Gift,
  PlusCircle,
  MinusCircle,
  Trash2,
} from 'lucide-react';

 

const CartDetailsView = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, setIsCartOpen, totalPrice, removeItemFromCart, addItemToCart, clearCart } = useCart();
  const { selectedRestaurant } = useRestaurant(); // Assuming selectedRestaurant holds details of the current restaurant
  const {isAuthenticated} = useAuth();

  const handleUpdateQuantity = (item, type) => {
    if (type === 'increase') {
      addItemToCart(item);
    } else if (type === 'decrease') {
      removeItemFromCart(item.id);
    }
  };

  const calculateSubtotal = (item) => (item.quantity * parseFloat(item.price)).toFixed(2);

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleNavigation = (path) => {
    if(path === '/checkout'){

      if(!isAuthenticated){ 
        navigate('/login');
        handleCloseCart();
        return;
      } else {
        navigate(path);
        handleCloseCart();
      }
    } else {
      navigate(path);
      handleCloseCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
        {/* Header Section */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mt-4 sm:mt-0">
            <ShoppingCart className="inline-block w-8 h-8 sm:w-10 sm:h-10 mr-3 align-middle" />
            Your Order Details
          </h1>
          <p className="text-center text-amber-100 mt-2 text-lg sm:text-xl">Review your delicious selection</p>
        </div>

        {/* Restaurant Info (Conditional) */}
        {selectedRestaurant && (
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-200">
            <h2 className="text-2xl font-bold text-amber-800 flex items-center mb-4">
              <Store className="w-6 h-6 mr-3 text-amber-600" />
              Ordering from: {selectedRestaurant.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <p className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                {selectedRestaurant.address || 'Address not available'}
              </p>
              <p className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-amber-500" />
                {selectedRestaurant.eta || 'Estimated delivery: 30-45 min'}
              </p>
            </div>
          </div>
        )}

        {/* Cart Items Section */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Package className="w-6 h-6 mr-3 text-gray-600" /> Your Items ({totalItems})
          </h2>
          {totalItems === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <p className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty!</p>
              <p className="text-md text-gray-500">Add some yummy food to get started.</p>
              <button
                onClick={() => navigate('/')} // Or to a menu page
                className="mt-6 px-8 py-3 bg-amber-600 text-white rounded-lg shadow-md hover:bg-amber-700 transition-colors transform hover:scale-105"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.values(cartItems).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-grow mb-4 sm:mb-0">
                    <p className="font-semibold text-lg text-gray-900">{item.name}</p>
                    <p className="text-gray-600 text-sm">${parseFloat(item.price).toFixed(2)} per item</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(item, 'decrease')}
                        className="p-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <MinusCircle size={20} />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-800 bg-white border-l border-r border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item, 'increase')}
                        className="p-2 bg-white hover:bg-gray-100 text-gray-700 transition-colors"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                    <p className="font-extrabold text-xl text-amber-700 w-24 text-right">
                      ${calculateSubtotal(item)}
                    </p>
                    <button
                      onClick={() => removeItemFromCart(item.id)} // This will remove one item, or the whole stack if quantity is 1
                      className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors transform hover:scale-110"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-3 text-gray-600" /> Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-lg text-gray-700">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <span className="text-2xl font-extrabold text-gray-900">Total</span>
              <span className="text-3xl font-extrabold text-amber-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                clearCart();
                // Optionally navigate somewhere after clearing
                navigate('/');
              }}
              className="w-full sm:w-auto flex-grow px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Cart
            </button>
            <button
              onClick={() => handleNavigation('/checkout')}
              disabled={totalItems === 0}
              className={`w-full sm:w-auto flex-grow px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition-colors transform font-semibold text-lg flex items-center justify-center
                          ${totalItems === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Gift className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetailsView;