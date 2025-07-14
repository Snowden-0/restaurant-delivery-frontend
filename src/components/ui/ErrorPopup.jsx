import React, { useEffect } from 'react';

const ErrorPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 z-50">
      <div className="bg-red-500 text-white text-xl px-6 py-4 rounded-lg shadow-lg flex items-center">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;