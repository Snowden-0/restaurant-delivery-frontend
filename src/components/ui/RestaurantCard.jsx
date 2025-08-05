import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ChefHat, Star } from 'lucide-react';
import { restaurantService } from '../../services/restaurantService';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { id, name, is_available, address, image_url, average_rating, total_ratings } = restaurant;
  const [cuisines, setCuisines] = useState([]);
  const [loadingCuisines, setLoadingCuisines] = useState(true);
  const [errorCuisines, setErrorCuisines] = useState(null);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        setLoadingCuisines(true);
        setErrorCuisines(null);
        const cuisineData = await restaurantService.getRestaurantCuisines(id);
        setCuisines(cuisineData);
      } catch (error) {
        setErrorCuisines(error.message);
        console.error('Error fetching cuisines:', error);
      } finally {
        setLoadingCuisines(false);
      }
    };

    fetchCuisines();
  }, [id]);

  const handleViewDetails = () => {
    navigate(`/restaurants/${id}`);
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  const RatingSkeleton = () => (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
    </div>
  );

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

        {/* Rating Section */}
        <div className="mb-3">
          {average_rating !== undefined && total_ratings !== undefined ? (
            // Show actual rating
            average_rating && total_ratings > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {renderStarRating(average_rating)}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {average_rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({total_ratings} {total_ratings === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">No reviews yet</span>
              </div>
            )
          ) : (
            <RatingSkeleton />
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{address}</span>
        </div>

        {/* Cuisines Pills */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-800">
              Cuisines
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {loadingCuisines ? (
              <div className="flex gap-2">
                <div className="h-7 w-20 rounded-full animate-pulse bg-gray-200" />
                <div className="h-7 w-24 rounded-full animate-pulse bg-gray-200" />
                <div className="h-7 w-18 rounded-full animate-pulse bg-gray-200" />
              </div>
            ) : errorCuisines ? (
              <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                Failed to load cuisines
              </span>
            ) : cuisines.length > 0 ? (
              cuisines.map((cuisine, index) => {
                const borderStyles = [
                  "border-orange-400 text-orange-500",
                  "border-green-500 text-green-600",
                  "border-yellow-400 text-yellow-600",
                ];
                const colorClass = borderStyles[index % borderStyles.length];

                return (
                  <span
                    key={index}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${colorClass}`}
                  >
                    {cuisine.name || cuisine}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-gray-500 px-3 py-1.5 rounded-full border border-gray-300">
                No cuisines available
              </span>
            )}
          </div>
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
          Order Now
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;