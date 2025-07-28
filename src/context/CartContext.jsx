import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAlert } from './AlertContext'; // Import useAlert

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showAlert } = useAlert(); // Use the showAlert function from AlertContext

  useEffect(() => {
    let itemsCount = 0;
    let priceSum = 0;
  
    cartItems.forEach(item => {
      itemsCount += item.quantity;
      priceSum += item.quantity * parseFloat(item.price);
    });

    setTotalItems(itemsCount);
    setTotalPrice(priceSum);
    
  }, [cartItems]);

  const addItemToCart = (item) => {
    if (!item.restaurantId) {
      showAlert("Sorry, this item cannot be added to the cart right now.", "error"); // Use custom alert
      return;
    }

    setCartItems((prevItems) => {
      // Check if cart has items from a different restaurant
      if (prevItems.length > 0 && prevItems[0].restaurantId !== item.restaurantId) {
        showAlert("You can only order from one restaurant at a time. Your previous cart has been cleared.", "warning"); // Use custom alert
        return [{ ...item, quantity: 1 }]; 
      }

      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItemFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === itemId);
      if (existingItemIndex === -1) return prevItems; 

      const updatedItems = [...prevItems];
      if (updatedItems[existingItemIndex].quantity > 1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity - 1,
        };
      } else {
        updatedItems.splice(existingItemIndex, 1);
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const contextValue = {
    cartItems,
    totalItems,
    totalPrice,
    addItemToCart,
    isCartOpen,
    setIsCartOpen,
    removeItemFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};