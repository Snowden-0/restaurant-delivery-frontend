import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const RestaurantHeader = ({ name, imageUrl, isAvailable }) => {
  return (
    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg mb-8">
      {/* Background Image */}
      <img 
        src={imageUrl} 
        alt={`Banner for ${name}`} 
        className="w-full h-full object-cover" 
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x300/e2e8f0/4a5568?text=Image+Not+Found'; }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{name}</h1>
        <div className={`flex items-center gap-3 font-semibold text-lg ${isAvailable ? 'text-green-300' : 'text-red-300'}`}>
          {isAvailable ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span>{isAvailable ? 'Open Now' : 'Currently Closed'}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;