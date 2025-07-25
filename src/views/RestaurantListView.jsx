import { useRestaurant } from '../context/RestaurantContext';
import RestaurantCard from '../components/ui/RestaurantCard';
import { Pagination } from 'antd';

const RestaurantListView = () => {
  const { 
    paginatedRestaurants,
    loading, 
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    changeItemsPerPage,
    searchTerm
  } = useRestaurant();

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Restaurants</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of the finest dining experiences in the city
          </p>
        </div>

        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
              {searchTerm ? (
                <>
                  Found <span className="font-medium">{totalItems}</span> restaurants 
                  matching "<span className="font-medium">{searchTerm}</span>"
                </>
              ) : (
                <>
                  Showing <span className="font-medium">{totalItems}</span> restaurants
                </>
              )}
            </div>
            
          </div>
        )}
        
        {paginatedRestaurants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            
            {/* Ant Design Pagination Component */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={itemsPerPage}
                onChange={(page) => goToPage(page)}
                onShowSizeChange={(current, size) => changeItemsPerPage(size)}
                showSizeChanger={true}
                pageSizeOptions={['6', '9', '12', '18']}
                showQuickJumper={true}
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} of ${total} restaurants`
                }
                className="ant-pagination-custom"
              />
            </div>
          </>
        ) : (
          /* No results message */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No restaurants match your search for "${searchTerm}". Try a different search term.`
                  : "No restaurants are currently available."
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListView;