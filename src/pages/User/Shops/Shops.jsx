import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../context/DarkModeContext';
import { getImageUrl, getDefaultShopLogo } from '../../../utils/imageUtils';
import { apiEndpoint } from '../../../utils/api.js';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  TagIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Shops = () => {
  const { isDarkMode } = useDarkMode();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    floor: 'all',
    search: '',
    sortBy: 'newest'
  });

  const categories = [
    { name: 'Cloth', displayName: 'Clothing', icon: '👕', color: 'from-pink-500 to-rose-500' },
    { name: 'Tech', displayName: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { name: 'Book', displayName: 'Books', icon: '📚', color: 'from-green-500 to-emerald-500' },
    { name: 'Beauty', displayName: 'Beauty', icon: '💄', color: 'from-purple-500 to-pink-500' },
    { name: 'Food', displayName: 'Food & Dining', icon: '🍕', color: 'from-yellow-500 to-orange-500' },
    { name: 'Other', displayName: 'Other', icon: '🛍️', color: 'from-gray-500 to-gray-600' }
  ];

  const floors = [
    { code: 'G', name: 'Ground Floor', description: 'Main entrance level' },
    { code: 'L1', name: 'Level 1', description: 'Fashion & lifestyle' },
    { code: 'L2', name: 'Level 2', description: 'Electronics & tech' },
    { code: 'L3', name: 'Level 3', description: 'Food court & dining' },
    { code: 'L5', name: 'Level 5', description: 'Entertainment & services' }
  ];

  useEffect(() => {
    fetchShops();
  }, [filters]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.floor !== 'all') {
        queryParams.append('floor', filters.floor);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.sortBy !== 'newest') {
        queryParams.append('sortBy', filters.sortBy);
      }

      const url = `${apiEndpoint(`/shops/public`)}?${queryParams}`;
      console.log('Fetching shops from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Shops data received:', data);
        setShops(data.shops);
      } else {
        const errorData = await response.text();
        console.error('Error response:', response.status, errorData);
        toast.error(`Failed to load shops: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      floor: 'all', 
      search: '',
      sortBy: 'newest'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <BuildingStorefrontIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Discover Amazing Shops
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore {shops.length}+ premium stores across all floors of our modern shopping mall
          </p>
        </motion.div>

        {/* Quick Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleFilterChange('category', 'all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filters.category === 'all'
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 backdrop-blur-md border border-gray-200 dark:border-gray-600'
              }`}
            >
              <SparklesIcon className="w-4 h-4 inline mr-1" />
              All Shops
            </button>
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.name}
                onClick={() => handleFilterChange('category', category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.category === category.name
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 backdrop-blur-md border border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.displayName}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search and Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search shops by name, category, or description..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shops.length} shop{shops.length !== 1 ? 's' : ''} found
              </span>
              {(filters.category !== 'all' || filters.floor !== 'all' || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              <FunnelIcon className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <TagIcon className="w-4 h-4 inline mr-1" />
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.name} value={category.name}>
                          {category.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Floor Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPinIcon className="w-4 h-4 inline mr-1" />
                      Floor
                    </label>
                    <select
                      value={filters.floor}
                      onChange={(e) => handleFilterChange('floor', e.target.value)}
                      className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                    >
                      <option value="all">All Floors</option>
                      {floors.map(floor => (
                        <option key={floor.code} value={floor.code}>
                          {floor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <StarIcon className="w-4 h-4 inline mr-1" />
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                    >
                      <option value="newest">Newest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="category">Category</option>
                      <option value="floor">Floor & Stall</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
              <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No shops found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
              We couldn't find any shops matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {shops.map((shop, index) => (
              <motion.div
                key={shop._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link 
                  to={`/shop/${shop._id}`}
                  className="block bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/30"
                >
                  {/* Shop Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(shop.shopLogo)}
                      alt={shop.shopName}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = getDefaultShopLogo();
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                        shop.isOpen 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                      }`}>
                        {shop.isOpen ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <XCircleIcon className="w-3 h-3" />
                        )}
                        {shop.isOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>

                    {/* Floor Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-md">
                        <MapPinIcon className="w-3 h-3" />
                        {shop.floorNumber}-{shop.stallNumber}
                      </div>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {shop.shopName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {categories.find(cat => cat.name === shop.category) && (
                            <span className="text-sm">
                              {categories.find(cat => cat.name === shop.category)?.icon}
                            </span>
                          )}
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {shop.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {shop.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <ClockIcon className="w-3 h-3" />
                        <span>By {shop.sellerId?.username}</span>
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        View Shop →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shops;