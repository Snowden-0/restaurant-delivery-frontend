import React, { useRef, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, XCircle, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const Cart = () => {
  const { cartItems,isCartOpen, setIsCartOpen, totalItems, totalPrice, removeItemFromCart } = useCart();
  const dropdownRef = useRef(null);
  const cartButtonRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <button
        ref={cartButtonRef}
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="relative p-2 rounded-xl bg-white shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
        aria-label="View cart"
      >
        <ShoppingCart size={20} className="text-gray-700" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {isCartOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" onClick={handleCloseCart} />
          
          <div
            ref={dropdownRef}
            className="fixed top-0 right-0 h-full w-full bg-white z-50 md:absolute md:right-0 md:top-12 md:w-96 md:h-auto md:rounded-2xl md:shadow-2xl md:border md:border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 md:rounded-t-2xl">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Your Order</h3>
                  <p className="text-sm text-gray-600">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={handleCloseCart}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-80 transition-colors"
                aria-label="Close cart"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Cart Content */}
            {totalItems === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h4>
                <p className="text-gray-500">Add some delicious items to get started!</p>
              </div>
            ) : (
              <div className="flex flex-col h-full md:h-auto">
                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh] md:max-h-80">
                  {Object.values(cartItems).map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-orange-600 font-bold text-lg">
                              ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItemFromCart(item.id)}
                                className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white md:rounded-b-2xl">
                  <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-orange-600">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handleNavigation('/cart-details')}
                      className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors font-semibold shadow-sm"
                    >
                      View Order Details
                    </button>
                    <button
                      onClick={() => handleNavigation('/checkout')}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-semibold shadow-lg"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;