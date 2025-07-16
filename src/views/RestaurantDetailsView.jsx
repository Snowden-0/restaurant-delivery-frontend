// pages/RestaurantDetailsPage.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Mail, Star, ArrowLeft, MapPin, Clock, ChefHat } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

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
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading restaurant details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedRestaurant) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Restaurant not found'}</p>
            <button 
              onClick={() => navigate('/restaurants')}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Back to Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { name, contact, menu, description, address, rating, cuisines, image, availability, location } = selectedRestaurant;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/restaurants')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </button>

        {/* Restaurant Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Restaurant Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3 flex items-center space-x-2 shadow-md">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-gray-700">{rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Restaurant Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              
              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{cuisines?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className={`font-medium ${availability?.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {availability?.isOpen ? 'Open' : 'Closed'} • {availability?.hours}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{description}</p>
              <p className="text-sm text-gray-500">{address}</p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{contact?.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{contact?.email}</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Menu Items</h3>
              <div className="grid gap-4">
                {menu?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <span className="font-semibold text-gray-900 text-lg ml-4">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsView;