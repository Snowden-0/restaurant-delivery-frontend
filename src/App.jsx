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
import ProfilePage from './views/UserProfileView';
import CheckoutPageView from './views/CheckoutPageView';
import OrderConfirmationView from './views/OrderConfirmationView'; // Import the new component

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Destructure isAuthenticated and isLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading application...</p>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
  const { error, clearError } = useAuth(); 

  return (
    <>
      {error && <ErrorPopup message={error} onClose={clearError} />}
      <Routes>
          <Route element={<Layout />}>
                {/* Protected Routes using PrivateRoute */}
                <Route path="/" element={<Navigate to="/restaurants" replace />} />
                <Route path="/restaurants" element={<RestaurantListView />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailsView />} />
                <Route path="/cart-details" element={<CartDetailView />} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><CheckoutPageView /></PrivateRoute>} />
                <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmationView /></PrivateRoute>} /> {/* New route */}
          </Route>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
        </Routes>
    </>
  );
}

export default App;