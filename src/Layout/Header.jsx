import React from 'react';
import UserProfile from './UserProfile';
import { Menu } from 'lucide-react';
import IconButton from '../components/ui/IconButton';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center">
          <IconButton 
            onClick={toggleSidebar}
            className="md:hidden mr-2"
            icon={<Menu className="w-5 h-5" />}
          />
          <h1 className="text-xl font-bold text-indigo-600">GourmetExpress</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <UserProfile 
            name="Alex Morgan"
            email="alex@example.com"
            avatarUrl="/avatar.png"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;