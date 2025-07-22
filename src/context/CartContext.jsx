import React, { createContext, useContext, useState, useEffect } from 'react';

const PARSE_CART_ERROR = 'Failed to parse cart from localStorage';
const SAVE_CART_ERROR = 'Failed to save cart to localStorage';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage if available
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error(PARSE_CART_ERROR, error);
      return {};
    }
  });

  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Effect to update total items and total price whenever cartItems changes
  useEffect(() => {
    let itemsCount = 0;
    let priceSum = 0;
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      itemsCount += item.quantity;
      priceSum += item.quantity * parseFloat(item.price);
    }
    setTotalItems(itemsCount);
    setTotalPrice(priceSum);

    // Save cart to localStorage
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error(SAVE_CART_ERROR, error);
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addItemToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems[item.id];
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      return {
        ...prevItems,
        [item.id]: { ...item, quantity: newQuantity },
      };
    });
  };

  const removeItemFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems[itemId];
      if (!existingItem) return prevItems; // Item not in cart

      if (existingItem.quantity > 1) {
        return {
          ...prevItems,
          [itemId]: { ...existingItem, quantity: existingItem.quantity - 1 },
        };
      } else {
        // Remove item completely if quantity is 1
        const newItems = { ...prevItems };
        delete newItems[itemId];
        return newItems;
      }
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const contextValue = {
    cartItems,
    totalItems,
    totalPrice,
    addItemToCart,
    removeItemFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
