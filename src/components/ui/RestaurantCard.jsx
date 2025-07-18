// components/RestaurantCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, ChefHat } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { id, name, is_available, address, image_url } = restaurant;

  const handleViewDetails = () => {
    navigate(`/restaurants/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Restaurant Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{address}</span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-500" />
          <span
            className={`text-sm font-medium flex items-center ${
              is_available ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 mr-1 rounded-full ${
                is_available ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {is_available ? "Open" : "Closed"}
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;