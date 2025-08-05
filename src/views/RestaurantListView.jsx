import { useRestaurant } from '../context/RestaurantContext';
import RestaurantCard from '../components/ui/RestaurantCard';
import FilterBar from '../components/filters/FilterBar';
import { Pagination } from 'antd';

const RestaurantListView = () => {
  const {
    restaurants, // This now receives the sorted array from context
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    limit,
    goToPage,
    changeItemsPerPage,
    filters,
    applyFilters,
    clearAllFilters,
    sortOption,
    setSortOption
  } = useRestaurant();

  const handlePageChange = (page) => {
    goToPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    changeItemsPerPage(size);
  };

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
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Something went wrong</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Restaurants
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of the finest dining experiences in the city
            </p>
          </div>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={(newFilters) => applyFilters(newFilters, 1, limit)}
        onClearAllFilters={clearAllFilters}
        totalResults={totalCount}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filters.name && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium">
                  Search results for "{filters.name}"
                  {totalCount > 0 && (
                    <span className="font-normal"> - {totalCount} restaurant{totalCount !== 1 ? 's' : ''} found</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {restaurants.length > 0 ? (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} restaurants
                </p>
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={limit}
                onChange={handlePageChange}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger={true}
                pageSizeOptions={['6', '9', '12', '18', '24']}
                showQuickJumper={true}
                className="ant-pagination-custom"
                disabled={loading}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No restaurants found</h3>
              <p className="text-gray-600 mb-6">
                {filters.name ? (
                  <>
                    No restaurants match your search for "<strong>{filters.name}</strong>" with the current filters.
                  </>
                ) : (
                  <>
                    No restaurants match your current filter criteria.
                  </>
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {filters.name && (
                  <button
                    onClick={() => applyFilters({ ...filters, name: '' }, 1, limit)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListView;