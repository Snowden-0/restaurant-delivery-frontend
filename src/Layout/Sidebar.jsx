import React from 'react';
import { 
  Home, 
  Utensils, 
  ShoppingCart, 
  Users, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import NavItem from './NavItem';
import ResizablePanel from '../components/ui/ResizablePanel';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { icon: <Home />, label: 'Dashboard', href: '/' },
    { icon: <Utensils />, label: 'Restaurants', href: '/restaurants' },
    { icon: <ShoppingCart />, label: 'Orders', href: '/orders' },
    { icon: <Users />, label: 'Customers', href: '/customers' },
    { icon: <Settings />, label: 'Settings', href: '/settings' },
    { icon: <HelpCircle />, label: 'Support', href: '/support' },
  ];

  return (
    <ResizablePanel 
      isOpen={isOpen} 
      defaultWidth={256}
      minWidth={80}
      maxWidth={320}
      className="hidden md:flex flex-col bg-white border-r"
    >
      <div className={`flex-1 overflow-y-auto py-4 ${isOpen ? 'px-4' : 'px-2'}`}>
        <div className="mb-8 flex items-center p-2">
          <div className="bg-indigo-600 rounded-lg p-2">
            <Utensils className="text-white w-6 h-6" />
          </div>
          {isOpen && (
            <h2 className="ml-3 text-xl font-bold text-gray-800">Gourmet</h2>
          )}
        </div>
        
        <nav>
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <NavItem 
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isOpen={isOpen}
              />
            ))}
          </ul>
        </nav>
      </div>
      
      <div className={`p-4 border-t ${isOpen ? 'text-center' : ''}`}>
        <p className="text-xs text-gray-500">
          {isOpen ? '© 2023 GourmetExpress' : '©'}
        </p>
      </div>
    </ResizablePanel>
  );
};

export default Sidebar;