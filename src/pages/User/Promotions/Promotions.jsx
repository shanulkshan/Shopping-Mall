import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../../context/DarkModeContext';
import { TagIcon, CalendarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { apiEndpoint } from '../../../utils/api.js';

const Promotions = () => {
  const { isDarkMode } = useDarkMode();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchPromotions();
  }, [filters]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint('/promotion'));
      
      if (response.ok) {
        const data = await response.json();
        let filteredData = data;

        // Apply search filter
        if (filters.search) {
          filteredData = data.filter(promotion => 
            promotion.itemName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            promotion.shopName?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        // Apply sorting
        if (filters.sortBy === 'discount') {
          filteredData.sort((a, b) => b.discountRate - a.discountRate);
        } else if (filters.sortBy === 'name') {
          filteredData.sort((a, b) => a.itemName?.localeCompare(b.itemName));
        } else if (filters.sortBy === 'price') {
          filteredData.sort((a, b) => a.newPrice - b.newPrice);
        }

        setPromotions(filteredData);
      } else {
        console.error('Failed to load promotions');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const isPromotionActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const handleImageError = (e) => {
    e.target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#6366f1"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="16">
          Promotion Image
        </text>
      </svg>
    `)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4">
            <TagIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
            Amazing Promotions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">Discover incredible deals and offers from our shops</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search promotions or shops..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-2">
              {[
                { key: 'newest', label: 'Latest' },
                { key: 'discount', label: 'Best Discount' },
                { key: 'name', label: 'Name A-Z' },
                { key: 'price', label: 'Price Low-High' }
              ].map((sort) => (
                <button
                  key={sort.key}
                  onClick={() => handleSortChange(sort.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filters.sortBy === sort.key
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {promotions.length} promotion{promotions.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Promotions Grid */}
        {promotions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <TagIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No promotions found</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back later for new exciting deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promotion) => (
              <div 
                key={promotion._id}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-105"
              >
                {/* Promotion Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={promotion.itemImage || `data:image/svg+xml;base64,${btoa(`
                      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#6366f1"/>
                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="16">
                          ${promotion.itemName || 'Promotion'}
                        </text>
                      </svg>
                    `)}`}
                    alt={promotion.itemName}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={handleImageError}
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {promotion.discountRate}% OFF
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                      isPromotionActive(promotion.startDate, promotion.endDate)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {isPromotionActive(promotion.startDate, promotion.endDate) ? 'Active' : 'Expired'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Item Name */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {promotion.itemName}
                  </h3>

                  {/* Shop Info */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <ShoppingBagIcon className="w-4 h-4 mr-1" />
                    <span>{promotion.shopName}</span>
                    <span className="mx-2">•</span>
                    <span>Floor {promotion.floorNumber}-{promotion.stallNumber}</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        LKR {Number(promotion.oldPrice)?.toFixed(2)}
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        LKR {Number(promotion.newPrice)?.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">You Save</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        LKR {(Number(promotion.oldPrice) - Number(promotion.newPrice)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{promotion.startDate} - {promotion.endDate}</span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
