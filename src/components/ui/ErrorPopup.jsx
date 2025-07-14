import React, { useEffect } from 'react';

const ERROR_POPUP_CLASS = 'bg-red-500 text-white text-xl px-6 py-4 rounded-lg shadow-lg flex items-center';
const CLOSE_BUTTON_CLASS = 'ml-4 text-white hover:text-gray-200';

const ErrorPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 z-50">
      <div className= {ERROR_POPUP_CLASS}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className={CLOSE_BUTTON_CLASS}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;