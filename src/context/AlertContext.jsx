import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlert from '../components/ui/CustomAlert'; // Import the new CustomAlert

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    message: '',
    description: '',
    type: 'info',
    isVisible: false,
    duration: 5000, // Default duration for auto-hide
  });

  const showAlert = useCallback((message, type = 'info', description = '', duration = 5000) => {
    setAlertState({
      message,
      description,
      type,
      isVisible: true,
      duration,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prevState) => ({ ...prevState, isVisible: false, message: '' }));
  }, []);

  // Automatically hide after duration
  React.useEffect(() => {
    if (alertState.isVisible && alertState.duration > 0) {
      const timer = setTimeout(() => {
        hideAlert();
      }, alertState.duration);
      return () => clearTimeout(timer);
    }
  }, [alertState.isVisible, alertState.duration, hideAlert]);

  const contextValue = {
    showAlert,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alertState.isVisible && (
        <CustomAlert
          message={alertState.message}
          description={alertState.description}
          type={alertState.type}
          onClose={hideAlert}
          duration={0} // Duration is managed by this provider, so pass 0 to CustomAlert
        />
      )}
    </AlertContext.Provider>
  );
};