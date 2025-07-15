import React from 'react';
import NavItem from './NavItem';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingCart, 
  Star, 
  Users, 
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, activeItem, onItemClick }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: UtensilsCrossed, label: 'Restaurants', href: '/restaurants' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: Star, label: 'Reviews', href: '/reviews' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:sticky lg:top-16 lg:translate-x-0 lg:z-auto
        ${isCollapsed ? 'lg:w-24' : 'lg:w-64'}
        w-64
        lg:h-[calc(100vh-4rem)]  // Height adjusted for header
      `}>
        
        <div className="flex flex-col h-full">
          {/* Logo - Hidden when collapsed on desktop */}
          {(!isCollapsed || isOpen) && (
            <div className="p-6 border-b border-gray-200 lg:hidden">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <UtensilsCrossed className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">FoodieExpress</h2>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <ul className="space-y-4 px-3">
              {menuItems.map((item, index) => (
                <NavItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={activeItem === item.href}
                  onClick={onItemClick}
                  isCollapsed={isCollapsed && !isOpen}
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;