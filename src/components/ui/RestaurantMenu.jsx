import { UtensilsCrossed, CheckCircle, XCircle, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Import useCart

const RestaurantMenu = ({ menuItems }) => {
  const { cartItems, addItemToCart, removeItemFromCart } = useCart(); // Use cart context

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoryOrder = ['Appetizers', 'Main Course', 'Side Dish', 'Desserts', 'Drinks'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-100">
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
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {groupedMenuItems[category].map((item) => {
                    const itemInCart = cartItems[item.id];
                    const quantity = itemInCart ? itemInCart.quantity : 0;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0 shadow-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/F3F4F6/D1D5DB?text=No+Image"; }}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 text-sm font-medium">
                            No Image
                          </div>
                        )}
                        <div className="flex-grow flex flex-col justify-between w-full"> {/* Added w-full */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2"> {/* Responsive adjustments */}
                            <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                            <p className="text-xl font-extrabold text-amber-700 whitespace-nowrap">
                              ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2 sm:gap-0"> {/* Responsive adjustments */}
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
                            {item.is_available && (
                              <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1 shadow-inner">
                                <button
                                  onClick={() => removeItemFromCart(item.id)}
                                  disabled={quantity === 0}
                                  className={`p-1 rounded-full transition-colors ${
                                    quantity === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-amber-500 text-white hover:bg-amber-600'
                                  }`}
                                  aria-label={`Remove one ${item.name}`}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-semibold text-gray-800 min-w-[20px] text-center">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => addItemToCart(item)}
                                  className="p-1 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                                  aria-label={`Add one ${item.name}`}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
