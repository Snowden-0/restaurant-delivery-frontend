import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

// Import the new modular components
import RestaurantHeader from '../components/ui/RestaurantHeader';
import RestaurantAbout from '../components/ui/RestaurantAbout';
import RestaurantMenu from '../components/ui/RestaurantMenu';
import RestaurantInfoSidebar from '../components/ui/RestaurantInfoSidebar';

const RestaurantDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedRestaurant, loading, error, getRestaurantById } = useRestaurant();

  useEffect(() => {
    if (id) {
      getRestaurantById(id);
    }
  }, [id, getRestaurantById]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !selectedRestaurant) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center text-center p-4">
        <div>
            <p className="text-red-600 mb-4 text-xl">{error || 'Restaurant not found'}</p>
            <button
                onClick={() => navigate('/restaurants')}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
                Back to Restaurants
            </button>
        </div>
      </div>
    );
  }

  const { name, phone, description, address, image_url, is_available, menu } = selectedRestaurant;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/restaurants')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to All Restaurants</span>
        </button>

        <RestaurantHeader name={name} imageUrl={image_url} isAvailable={is_available} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RestaurantAbout name={name} description={description} />
            <RestaurantMenu menuItems={menu || []} />
          </div>
          <RestaurantInfoSidebar address={address} phone={phone} />
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetailsView;