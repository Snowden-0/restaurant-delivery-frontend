import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { AuthProvider } from './contexts/AuthContext';
import Layout from './Layout/Layout';
import LoginPage from './views/user/LoginPage';
import SignupPage from './views/user/SignupPage';
import RestaurantListView from './views/RestaurantListView';
import RestaurantDetailsView from './views/RestaurantDetailsView';
import { RestaurantProvider } from './context/RestaurantContext';
import ErrorPopup from './components/ui/ErrorPopup';
import { CartProvider } from './context/CartContext'; 

function App() {
  return (
    <>
    <RestaurantProvider>
      <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/restaurants" replace />} />
            <Route path="/restaurants" element={<RestaurantListView />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailsView />} />
          </Routes>
        </Layout>
      </Router>
      </CartProvider>
    </RestaurantProvider>
    </>
    
  );
}

export default App;