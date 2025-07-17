import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const RestaurantMenu = ({ menuItems }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <UtensilsCrossed className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-800">Our Menu</h2>
      </div>
      <div className="space-y-6">
        {menuItems && menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-b-0">
              <div>
                <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
              </div>
              <p className="text-lg font-semibold text-gray-800 ml-4 whitespace-nowrap">{item.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Menu information is not available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;