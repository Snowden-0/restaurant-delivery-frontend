import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import RestaurantHeader from '../components/ui/RestaurantHeader';
import RestaurantAbout from '../components/ui/RestaurantAbout';
import RestaurantMenu from '../components/ui/RestaurantMenu';
import RestaurantInfoSidebar from '../components/ui/RestaurantInfoSidebar';

const RestaurantDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedRestaurant, loading, error, getRestaurantById } = useRestaurant();
  
  // Local state for menu search
  const [menuSearchTerm, setMenuSearchTerm] = useState('');

  useEffect(() => {
    if (id) {
      getRestaurantById(id);
    }
  }, [id, getRestaurantById]);

  // Reset search when restaurant changes
  useEffect(() => {
    setMenuSearchTerm('');
  }, [selectedRestaurant]);

  // Filter menu items based on search term (name only)
  const filteredMenuItems = useMemo(() => {
    if (!selectedRestaurant?.menu || menuSearchTerm === '') {
      return selectedRestaurant?.menu || [];
    }

    const lowercasedTerm = menuSearchTerm.toLowerCase();
    return selectedRestaurant.menu.filter(item =>
      item.name?.toLowerCase().includes(lowercasedTerm)
    );
  }, [selectedRestaurant?.menu, menuSearchTerm]);

  const handleSearchChange = (e) => {
    setMenuSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setMenuSearchTerm('');
  };

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
            
            {/* Menu Search Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search menu items by name..."
                    value={menuSearchTerm}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {menuSearchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results Info */}
              {menuSearchTerm && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredMenuItems.length === 0 ? (
                    <p>No menu items found for "{menuSearchTerm}"</p>
                  ) : (
                    <p>
                      Showing {filteredMenuItems.length} of {menu?.length || 0} items
                      {filteredMenuItems.length !== menu?.length && ` for "${menuSearchTerm}"`}
                    </p>
                  )}
                </div>
              )}

              {/* Menu Items */}
              <RestaurantMenu menuItems={filteredMenuItems} />
            </div>
          </div>
          <RestaurantInfoSidebar address={address} phone={phone} />
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetailsView;