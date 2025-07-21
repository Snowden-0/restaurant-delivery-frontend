import React, { useRef, useEffect, useState } from 'react';
import { ShoppingCart, XCircle, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Adjust path as needed

const Cart = () => {
  const { cartItems, totalItems, totalPrice, removeItemFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control cart dropdown visibility
  const dropdownRef = useRef(null);
  const cartButtonRef = useRef(null); // Ref for the cart icon button

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close if click is outside the dropdown AND not on the cart button itself
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
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  // Function to close the cart dropdown (can be passed to buttons inside)
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const COMMON_BUTTON_CLASSES = 'p-2 rounded-lg hover:bg-gray-100 transition-colors';

  return (
    <div className="relative"> {/* Added relative positioning for dropdown */}
      <button
        ref={cartButtonRef} // Attach ref to the button
        onClick={() => setIsCartOpen(!isCartOpen)} // Toggle cart dropdown
        className={`${COMMON_BUTTON_CLASSES} relative`}
        aria-label="View cart"
      >
        <ShoppingCart size={24} className="text-gray-600" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isCartOpen && ( // Conditionally render the dropdown content
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-full sm:w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right animate-fade-in-down"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-amber-600" /> Your Cart ({totalItems})
            </h3>
            <button
              onClick={handleCloseCart}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close cart"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {totalItems === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-2">No Menu Items are selected yet.</p>
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {Object.values(cartItems).map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-amber-700 text-sm">${(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
                      <button
                        onClick={() => removeItemFromCart(item.id)}
                        className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                        aria-label={`Remove one ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-extrabold text-amber-700">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => { /* Implement navigation to View Order page */ handleCloseCart(); }}
                    className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
                  >
                    View Order
                  </button>
                  <button
                    onClick={() => { /* Implement navigation to Checkout page */ handleCloseCart(); }}
                    className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
                  >
                    Go to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;