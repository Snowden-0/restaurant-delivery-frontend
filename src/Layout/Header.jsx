import { useState } from 'react';
import { X, UtensilsCrossed, Search, ShoppingCart } from 'lucide-react'; // Import ShoppingCart
import UserProfile from './UserProfile';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext'; // Import useCart

// ... (constants can remain the same)
const COMMON_BUTTON_CLASSES = 'p-2 rounded-lg hover:bg-gray-100 transition-colors';
const INPUT_BASE_CLASSES = 'w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all';
const SEARCH_ICON_CLASSES = 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400';
const MOBILE_CLOSE_BUTTON_CLASSES = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600';
const HEADER_CLASSES = 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50';
const INNER_CONTAINER_CLASSES = 'flex items-center justify-between px-4 py-3';
const LOGO_CONTAINER_CLASSES = 'bg-gray-900 p-2 rounded-lg flex items-center justify-center';
const TITLE_CLASSES = 'text-xl font-extrabold text-gray-800 hidden sm:block';


const Header = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { searchTerm, setSearchTerm } = useRestaurant();
  const { totalItems } = useCart(); // Get totalItems from cart context

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <header className={`${HEADER_CLASSES} h-20`}>
      <div className={INNER_CONTAINER_CLASSES}>
        {/* Left Section */}
        <div className="flex items-center space-x-4">  
          <div className="flex items-center space-x-2">
            <div className={LOGO_CONTAINER_CLASSES}>
              <UtensilsCrossed className="text-white" size={28} />
            </div>
            <h1 className={TITLE_CLASSES}>FoodieExpress</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-lg mx-4">
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Search className={SEARCH_ICON_CLASSES} size={18} />
            <input
              type="text"
              placeholder="Search by restaurant name..."
              className={`${INPUT_BASE_CLASSES} pr-4`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Mobile Search */}
          {showMobileSearch && (
            <div className="relative md:hidden">
              <Search className={SEARCH_ICON_CLASSES} size={18} />
              <input
                type="text"
                placeholder="Search..."
                className={`${INPUT_BASE_CLASSES} pr-10`}
                autoFocus
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className={MOBILE_CLOSE_BUTTON_CLASSES}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {!showMobileSearch && (
            <button
              onClick={() => setShowMobileSearch(true)}
              className={`${COMMON_BUTTON_CLASSES} md:hidden`}
            >
              <Search size={18} className="text-gray-600" />
            </button>
          )}

          {/* Cart Icon */}
          <button
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

          {/* User Profile */}
          <UserProfile/>
        </div>
      </div>
    </header>
  );
};

export default Header;