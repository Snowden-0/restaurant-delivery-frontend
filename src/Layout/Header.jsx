import React, { useState } from 'react';
import { Menu, X, UtensilsCrossed, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import UserProfile from './UserProfile';

// Common UI Constants
const COMMON_BUTTON_CLASSES = 'p-2 rounded-lg hover:bg-gray-100 transition-colors';
const INPUT_BASE_CLASSES = 'w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all';
const SEARCH_ICON_CLASSES = 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400';
const MOBILE_CLOSE_BUTTON_CLASSES = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600';

// Header-specific Constants
const HEADER_CLASSES = 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50';
const INNER_CONTAINER_CLASSES = 'flex items-center justify-between px-4 py-3';
const LOGO_CONTAINER_CLASSES = 'bg-gray-900 p-2 rounded-lg flex items-center justify-center';
const TITLE_CLASSES = 'text-xl font-extrabold text-gray-800 hidden sm:block';

const Header = ({ onToggleSidebar, isSidebarOpen, onToggleSidebarCollapse, isSidebarCollapsed }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className={`${HEADER_CLASSES} h-20`}>
      <div className={INNER_CONTAINER_CLASSES}>
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className={`${COMMON_BUTTON_CLASSES} lg:hidden`}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop sidebar collapse button */}
          <button
            onClick={onToggleSidebarCollapse}
            className={`${COMMON_BUTTON_CLASSES} hidden lg:flex`}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
          </button>
          
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
              placeholder="Search..."
              className={`${INPUT_BASE_CLASSES} pr-4`}
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
          {/* User Profile */}
          <UserProfile/>
        </div>
      </div>
    </header>
  );
};

export default Header;