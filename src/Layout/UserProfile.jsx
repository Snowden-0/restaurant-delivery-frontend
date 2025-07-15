import React, { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';

const UserProfile = ({ name, email, avatarUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{name}</p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">{email}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;