import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const CustomAlert = ({ message, description, type = 'info', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true); // Ensure visibility when message changes

    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, description, type, duration, onClose]);

  if (!isVisible || !message) {
    return null;
  }

  let bgColorClass = '';
  let borderColorClass = '';
  let textColorClass = '';
  let iconComponent = null;

  switch (type) {
    case 'success':
      bgColorClass = 'bg-green-100';
      borderColorClass = 'border-green-400';
      textColorClass = 'text-green-800';
      iconComponent = <CheckCircle className="w-5 h-5" />;
      break;
    case 'error':
      bgColorClass = 'bg-red-100';
      borderColorClass = 'border-red-400';
      textColorClass = 'text-red-800';
      iconComponent = <XCircle className="w-5 h-5" />;
      break;
    case 'warning':
      bgColorClass = 'bg-yellow-100';
      borderColorClass = 'border-yellow-400';
      textColorClass = 'text-yellow-800';
      iconComponent = <AlertTriangle className="w-5 h-5" />;
      break;
    case 'info':
    default:
      bgColorClass = 'bg-blue-100';
      borderColorClass = 'border-blue-400';
      textColorClass = 'text-blue-800';
      iconComponent = <Info className="w-5 h-5" />;
      break;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-start space-x-3 transition-all duration-300 transform ${bgColorClass} border ${borderColorClass} max-w-sm w-full`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${textColorClass}`}>
        {iconComponent}
      </div>
      <div className="flex-grow">
        <p className={`font-bold text-sm ${textColorClass}`}>{message}</p>
        {description && <p className={`text-xs ${textColorClass} mt-1`}>{description}</p>}
      </div>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 p-1 rounded-full ${textColorClass} hover:bg-opacity-20 transition-colors`}
        aria-label="Close alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CustomAlert;
