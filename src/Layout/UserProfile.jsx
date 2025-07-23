import { useState, useEffect } from 'react';
import { ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router'; 
import ConfirmationModal from '../components/ui/ConfirmationModal'; 

const COMMON_BUTTON_CLASSES = 'flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors';
const AVATAR_CONTAINER_CLASSES = 'w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center';
const USER_NAME_CLASSES = 'text-gray-700 font-medium hidden sm:block';
const DROPDOWN_MENU_CLASSES = 'absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10';
const DROPDOWN_HEADER_CLASSES = 'px-4 py-2 border-b border-gray-100';
const DROPDOWN_ITEM_CLASSES = 'block px-4 py-2 transition-colors';
const REGULAR_ITEM_CLASSES = `${DROPDOWN_ITEM_CLASSES} text-gray-700 hover:bg-gray-50`;
const LOGOUT_ITEM_CLASSES = `${DROPDOWN_ITEM_CLASSES} text-red-600 hover:bg-red-50`;

const UserProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const { user, logout } = useAuth(); 

  
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  useEffect(() => {
    if (showDropdown) {
      const handleClick = () => setShowDropdown(false);
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showDropdown]);

  const handleLogoutConfirm = () => {
    logout(); 
    setShowLogoutModal(false); 
    setShowDropdown(false); 
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className={COMMON_BUTTON_CLASSES}
      >
        <div className={AVATAR_CONTAINER_CLASSES}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className={USER_NAME_CLASSES}>{userName}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {showDropdown && (
        <div className={DROPDOWN_MENU_CLASSES} onClick={(e) => e.stopPropagation()}>
          <div className={DROPDOWN_HEADER_CLASSES}>
            <p className="font-medium text-gray-800">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
          <Link to="/profile" className={REGULAR_ITEM_CLASSES}>
            <Settings size={16} className="inline mr-2" />
            Profile & Settings
          </Link>
          <hr className="my-2" />
          <button
            onClick={() => setShowLogoutModal(true)} 
            className={LOGOUT_ITEM_CLASSES + " w-full text-left"} 
          >
            Logout
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={showLogoutModal}
        message="Are you sure you want to log out?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default UserProfile;
