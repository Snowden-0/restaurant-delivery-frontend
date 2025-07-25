import React, { createContext, useContext, useState, useEffect } from 'react';

const PARSE_CART_ERROR = 'Failed to parse cart from localStorage';
const SAVE_CART_ERROR = 'Failed to save cart to localStorage';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
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
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error(SAVE_CART_ERROR, error);
    }
  }, [cartItems]);

  const addItemToCart = (item) => {
    if (!item.restaurantId) {
      console.error("Attempted to add an item to cart without a restaurantId.", item);
      alert("Sorry, this item cannot be added to the cart right now.");
      return;
    }

    setCartItems((prevItems) => {
      const cartValues = Object.values(prevItems);
      
      // Check if cart has items from a different restaurant
      if (cartValues.length > 0 && cartValues[0].restaurantId !== item.restaurantId) {
        alert("You can only order from one restaurant at a time. Your previous cart has been cleared.");
        return {
          [item.id]: { ...item, quantity: 1 },
        };
      }

      // If cart is empty or item is from the same restaurant, add/update it
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
      if (!existingItem) return prevItems;

      if (existingItem.quantity > 1) {
        return {
          ...prevItems,
          [itemId]: { ...existingItem, quantity: existingItem.quantity - 1 },
        };
      } else {
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