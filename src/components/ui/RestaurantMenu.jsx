import React from 'react';
import { UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react';

const RestaurantMenu = ({ menuItems }) => {
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoryOrder = ['Appetizers', 'Main Course', 'Side Dish', 'Desserts', 'Drinks'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <UtensilsCrossed className="w-6 h-6 text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-800">Our Menu</h2>
      </div>
      
      <div className="space-y-10">
        {Object.keys(groupedMenuItems).length > 0 ? (
          Object.keys(groupedMenuItems)
            .sort((a, b) => {
              const indexA = categoryOrder.indexOf(a);
              const indexB = categoryOrder.indexOf(b);
              if (indexA === -1 && indexB === -1) return a.localeCompare(b);
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            })
            .map((category) => (
              <div key={category} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {groupedMenuItems[category].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/F3F4F6/D1D5DB?text=No+Image"; }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                          No Image
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-lg font-medium text-amber-600 whitespace-nowrap">
                            ${parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 mb-2">{item.description}</p>
                        <div className="text-xs font-medium">
                          {item.is_available ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" /> Available
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center">
                              <XCircle className="w-3 h-3 mr-1" /> Not Available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-center py-8">Menu information is not available.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;