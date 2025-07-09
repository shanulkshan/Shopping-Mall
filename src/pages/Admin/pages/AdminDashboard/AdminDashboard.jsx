import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../../../context/DarkModeContext';
import { Link } from 'react-router-dom';
import { apiEndpoint } from '../../../../utils/api.js';
import {
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  TagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { isDarkMode } = useDarkMode();
  const [stats, setStats] = useState({
    totalShops: 0,
    pendingShops: 0,
    activeShops: 0,
    totalPromotions: 0,
    activePromotions: 0,
    totalItems: 0
  });
  const [recentShops, setRecentShops] = useState([]);
  const [recentPromotions, setRecentPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch shops data
      const shopsResponse = await fetch(apiEndpoint('/shop/admin/all'), {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Fetch promotions data
      const promotionsResponse = await fetch(apiEndpoint('/promotion'), {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Fetch items data
      const itemsResponse = await fetch('http://localhost:3000/api/item', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (shopsResponse.ok) {
        const shopsData = await shopsResponse.json();
        console.log('Shops data received:', shopsData);
        const shops = shopsData.shops || [];
        
        const pendingShops = shops.filter(shop => shop.isApproved === false);
        const activeShops = shops.filter(shop => shop.isApproved === true);
        
        console.log('Pending shops:', pendingShops.length, pendingShops);
        console.log('Active shops:', activeShops.length);
        
        setStats(prev => ({
          ...prev,
          totalShops: shops.length,
          pendingShops: pendingShops.length,
          activeShops: activeShops.length
        }));
        
        // Get recent shops (last 5)
        setRecentShops(shops.slice(0, 5));
      } else {
        console.error('Failed to fetch shops:', shopsResponse.status, shopsResponse.statusText);
        const errorText = await shopsResponse.text();
        console.error('Error response:', errorText);
      }

      if (promotionsResponse.ok) {
        const promotionsData = await promotionsResponse.json();
        const promotions = promotionsData.promotions || [];
        
        const activePromotions = promotions.filter(promo => 
          new Date(promo.endDate) > new Date() && promo.isActive
        );
        
        setStats(prev => ({
          ...prev,
          totalPromotions: promotions.length,
          activePromotions: activePromotions.length
        }));
        
        // Get recent promotions (last 5)
        setRecentPromotions(promotions.slice(0, 5));
      }

      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        const items = itemsData.items || [];
        
        setStats(prev => ({
          ...prev,
          totalItems: items.length
        }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Shops',
      value: stats.totalShops,
      change: '+12%',
      changeType: 'increase',
      icon: BuildingStorefrontIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      link: '/admin/shop-approval'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingShops,
      change: `${stats.pendingShops} waiting`,
      changeType: stats.pendingShops > 0 ? 'warning' : 'stable',
      icon: ClockIcon,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-500/10',
      link: '/admin/shop-approval'
    },
    {
      title: 'Active Shops',
      value: stats.activeShops,
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      link: '/admin/shop-approval'
    },
    {
      title: 'Total Products',
      value: stats.totalItems,
      change: '+24%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      link: '/shops'
    },
    {
      title: 'Active Promotions',
      value: stats.activePromotions,
      change: `${stats.totalPromotions} total`,
      changeType: 'stable',
      icon: GiftIcon,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-500/10',
      link: '/admin/promotion-list'
    },
    {
      title: 'Revenue',
      value: '$12,450',
      change: '+15%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      link: '#'
    }
  ];

  const quickActions = [
    {
      title: 'Approve New Shops',
      description: 'Review and approve pending shop applications',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      link: '/admin/shop-approval',
      badge: stats.pendingShops > 0 ? stats.pendingShops : null
    },
    {
      title: 'Manage Promotions',
      description: 'Create and manage promotional campaigns',
      icon: GiftIcon,
      color: 'bg-purple-500',
      link: '/admin/promotion-list'
    },
    {
      title: 'View Analytics',
      description: 'Check detailed business analytics',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      link: '#'
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: UserGroupIcon,
      color: 'bg-orange-500',
      link: '#'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Admin Dashboard
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome back! Here's what's happening with Serendib Plaza today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`${
                isDarkMode 
                  ? 'bg-gray-800/70 border-gray-700/30' 
                  : 'bg-white/70 border-gray-200/30'
              } backdrop-blur-xl rounded-3xl p-6 border hover:shadow-xl transition-all duration-300`}
            >
              <Link to={stat.link} className="block">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color.split('-')[1]}-500`} />
                  </div>
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'increase' ? 'text-green-500' : 
                    stat.changeType === 'warning' ? 'text-orange-500' : 
                    'text-gray-500'
                  }`}>
                    {stat.changeType === 'increase' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
                    {stat.changeType === 'decrease' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
                    {stat.changeType === 'warning' && <ExclamationTriangleIcon className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {stat.title}
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`${
                  isDarkMode 
                    ? 'bg-gray-800/70 border-gray-700/30' 
                    : 'bg-white/70 border-gray-200/30'
                } backdrop-blur-xl rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 relative`}
              >
                <Link to={action.link} className="block">
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {action.badge}
                    </div>
                  )}
                  <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Shops */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700/30' 
                : 'bg-white/70 border-gray-200/30'
            } backdrop-blur-xl rounded-3xl p-6 border`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Shop Applications
              </h3>
              <Link 
                to="/admin/shop-approval"
                className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentShops.length > 0 ? recentShops.map((shop, index) => (
                <motion.div
                  key={shop._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  } rounded-2xl hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <BuildingStorefrontIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {shop.shopName}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {shop.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shop.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : shop.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {shop.status}
                    </span>
                    <Link 
                      to="/admin/shop-approval"
                      className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <BuildingStorefrontIcon className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No recent shop applications
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Promotions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700/30' 
                : 'bg-white/70 border-gray-200/30'
            } backdrop-blur-xl rounded-3xl p-6 border`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Promotions
              </h3>
              <Link 
                to="/admin/promotion-list"
                className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentPromotions.length > 0 ? recentPromotions.map((promotion, index) => (
                <motion.div
                  key={promotion._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  } rounded-2xl hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <GiftIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {promotion.description?.substring(0, 30)}...
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {promotion.discount}% off
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      promotion.isActive && new Date(promotion.endDate) > new Date()
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {promotion.isActive && new Date(promotion.endDate) > new Date() ? 'Active' : 'Inactive'}
                    </span>
                    <Link 
                      to="/admin/promotion-list"
                      className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <GiftIcon className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No recent promotions
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;