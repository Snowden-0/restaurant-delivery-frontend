import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import LoginPage from './views/user/LoginPage';
import SignupPage from './views/user/SignupPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import RestaurantListView from './views/RestaurantListView';
import RestaurantDetailsView from './views/RestaurantDetailsView';
import { RestaurantProvider } from './context/RestaurantContext';
import ErrorPopup from './components/ui/ErrorPopup';
import { CartProvider } from './context/CartContext'; 
import CartDetailView from './views/CartDetailView';


const MAIN_DIV_CLASS = 'min-h-screen flex items-center justify-center bg-gray-900';

function App() {
  return (
    <>
       <Router>
          <AuthProvider>
            <RestaurantProvider>
              <CartProvider> 
               <AppContent />
              </CartProvider>
            </RestaurantProvider> 
          </AuthProvider>
        </Router>  
    

    </>
    
  );
}

function AppContent() {
  const { error, clearError } = useAuth(); // Now useAuth is called within AuthProvider's scope

  return (
    <>
      {error && <ErrorPopup message={error} onClose={clearError} />}
      <Routes>
          <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/restaurants" replace />} />
                <Route path="/restaurants" element={<RestaurantListView />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailsView />} />
                <Route path="/cart-details" element={<CartDetailView />} />
          </Route>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            {/* Routes that use the Layout */}
            
        </Routes>
    </>
  );
}



export default App;