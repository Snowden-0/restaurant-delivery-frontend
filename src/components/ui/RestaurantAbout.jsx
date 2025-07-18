import React from 'react';

const RestaurantAbout = ({ name, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
      <p className="text-gray-600 leading-relaxed">
        {description || 'No description available for this restaurant.'}
      </p>
    </div>
  );
};

export default RestaurantAbout;