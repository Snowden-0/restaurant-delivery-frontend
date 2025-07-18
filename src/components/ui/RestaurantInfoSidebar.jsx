import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const RestaurantInfoSidebar = ({ address, phone }) => {
  return (
    <aside className="lg:col-span-1">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Contact & Location</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
            <span className="text-gray-700">{address}</span>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
            <span className="text-gray-700">{phone}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RestaurantInfoSidebar;