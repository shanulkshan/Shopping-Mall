import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SellerDashboard = () => {
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    totalViews: 0,
    avgRating: 0
  });

  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userType !== 'seller') {
      navigate('/');
      return;
    }
    fetchSellerData();
  }, [user, navigate]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      
      // Fetch shop details
      const shopResponse = await fetch('http://localhost:3000/api/shops/my-shop', {
        credentials: 'include'
      });
      
      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        setShop(shopData.shop);
      }

      // Fetch seller's items
      const itemsResponse = await fetch('http://localhost:3000/api/item/my-items', {
        credentials: 'include'
      });
      
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items);
        
        // Calculate stats
        const totalItems = itemsData.items.length;
        const activeItems = itemsData.items.filter(item => item.isActive).length;
        const totalViews = itemsData.items.reduce((sum, item) => sum + item.views, 0);
        const avgRating = totalItems > 0 
          ? itemsData.items.reduce((sum, item) => sum + item.rating, 0) / totalItems 
          : 0;
        
        setStats({
          totalItems,
          activeItems,
          totalViews,
          avgRating: avgRating.toFixed(1)
        });
      }
    } catch (error) {
      toast.error('Failed to load seller data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/item/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Item deleted successfully');
        fetchSellerData(); // Refresh data
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleShopStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/shops/toggle-status', {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchSellerData(); // Refresh data to get updated shop status
      } else {
        toast.error('Failed to update shop status');
      }
    } catch (error) {
      toast.error('Failed to update shop status');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl shadow-xl p-8 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className="mb-6">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Shop Not Found</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Your shop registration is pending approval or there was an error.
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Seller Dashboard</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage your shop and products with ease</p>
          </div>
        </div>

        {/* Shop Status */}
        <div className={`mb-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md shadow-xl rounded-2xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{shop.shopName}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {shop.category} • Floor {shop.floorNumber}, Stall {shop.stallNumber}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Edit Shop Button */}
              <button
                onClick={() => navigate('/seller/edit-shop')}
                className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20' : 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'}`}
              >
                Edit Shop
              </button>

              {/* Shop Open/Close Toggle */}
              {shop.isApproved && (
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Shop Status:</span>
                  <button
                    onClick={handleToggleShopStatus}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} ${
                      shop.isOpen ? 'bg-green-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        shop.isOpen ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${shop.isOpen ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              )}
              
              {/* Approval Status */}
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${
                shop.isApproved 
                  ? isDarkMode 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-green-100 text-green-800 border-green-200'
                  : isDarkMode
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}>
                {shop.isApproved ? 'Approved' : 'Pending Approval'}
              </div>
            </div>
          </div>
        </div>

        {shop.isApproved ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Total Items</h3>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalItems}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <svg className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Active Items</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.activeItems}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Total Views</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl shadow-xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Avg Rating</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}⭐</p>
                  </div>
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/seller/add-item')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Item
              </button>
            </div>

            {/* Items List */}
            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md shadow-xl rounded-2xl border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Items</h3>
              </div>
              
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>No items yet. Start by adding your first product!</p>
                  <button
                    onClick={() => navigate('/seller/add-item')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Item
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Price
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Stock
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Status
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {items.map((item) => (
                        <tr key={item._id} className={`hover:${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors duration-200`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-12 w-12 rounded-xl mr-4 object-cover bg-gray-200 shadow-md" 
                                src={item.images && item.images[0] && (item.images[0].startsWith('data:') || item.images[0].startsWith('http'))
                                  ? item.images[0] 
                                  : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkM5IDEyIDEgMjAgMSAyMFMxMCAyOCAyMCAyOFMzOSAyMCAzOSAyMFMzMCAxMiAyMCAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDIzQzIxLjY1NjkgMjMgMjMgMjEuNjU2OSAyMyAyMEMyMyAxOC4zNDMxIDIxLjY1NjkgMTcgMjAgMTdDMTguMzQzMSAxNyAxNyAxOC4zNDMxIDE3IDIwQzE3IDIxLjY1NjkgMTguMzQzMSAyMyAyMCAyM1oiIGZpbGw9IiM2MzY5NzUiLz4KPC9zdmc+Cg=='
                                } 
                                alt={item.name}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkM5IDEyIDEgMjAgMSAyMFMxMCAyOCAyMCAyOFMzOSAyMCAzOSAyMFMzMCAxMiAyMCAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDIzQzIxLjY1NjkgMjMgMjMgMjEuNjU2OSAyMyAyMEMyMyAxOC4zNDMxIDIxLjY1NjkgMTcgMjAgMTdDMTguMzQzMSAxNyAxNyAxOC4zNDMxIDE3IDIwQzE3IDIxLjY1NjkgMTguMzQzMSAyMyAyMCAyM1oiIGZpbGw9IiM2MzY5NzUiLz4KPC9zdmc+Cg==';
                                }}
                              />
                              <div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</div>
                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              ${item.price}
                              {item.discount > 0 && (
                                <span className="ml-2 text-xs text-red-600">
                                  ({item.discount}% off)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                              item.isActive 
                                ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                                : 'bg-red-500/20 text-red-500 border-red-500/30'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/seller/edit-item/${item._id}`)}
                              className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'} mr-4 px-3 py-1 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-indigo-500/10' : 'hover:bg-indigo-50'}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'} px-3 py-1 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={`${isDarkMode ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'} border rounded-2xl p-6 backdrop-blur-md`}>
            <div className="flex">
              <div className={`flex-shrink-0 p-2 rounded-xl ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'} mr-4`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} mb-2`}>
                  Shop Pending Approval
                </h3>
                <div className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  <p>
                    Your shop registration is currently under review. You'll be able to add items once your shop is approved by our admin team.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/seller/edit-shop')}
                    className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-800 hover:text-yellow-900'} underline`}
                  >
                    Edit Shop Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
