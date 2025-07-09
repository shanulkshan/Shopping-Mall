import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../../context/DarkModeContext';
import { getImageUrl, getDefaultShopLogo } from '../../../utils/imageUtils';
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  EyeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    fetchShopDetails();
    fetchShopItems();
  }, [shopId]);

  const fetchShopDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/shops/${shopId}`);
      
      if (response.ok) {
        const data = await response.json();
        setShop(data.shop);
      } else {
        toast.error('Shop not found');
      }
    } catch (error) {
      toast.error('Failed to load shop details');
    }
  };

  const fetchShopItems = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/item/shop/${shopId}`);
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load shop items');
    } finally {
      setLoading(false);
    }
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

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shop not found</h1>
          <Link 
            to="/shops" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/shops')}
          className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to Shops</span>
        </motion.button>

        {/* Shop Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden mb-8"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-64 w-full object-cover md:w-64"
                src={getImageUrl(shop.shopLogo)}
                alt={shop.shopName}
                onError={(e) => {
                  e.target.src = getDefaultShopLogo();
                }}
              />
            </div>
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BuildingStorefrontIcon className="w-6 h-6 text-blue-500" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{shop.shopName}</h1>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <TagIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {shop.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      Floor {shop.floorNumber}, Stall {shop.stallNumber}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    shop.isOpen 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  }`}>
                    {shop.isOpen ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <XCircleIcon className="w-4 h-4" />
                    )}
                    {shop.isOpen ? 'Open Now' : 'Closed'}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{shop.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <CubeIcon className="w-4 h-4" />
                  Owned by {shop.sellerId?.username}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shop Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <CubeIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CubeIcon className="w-10 h-10 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products yet</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                This shop hasn't added any products yet. Check back soon for amazing items!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => navigate(`/product/${item._id}`)}
                  onMouseEnter={() => setHoveredItem(item._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/30 hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden h-80">
                    <img
                      src={hoveredItem === item._id && item.images && item.images[1] 
                        ? (item.images[1].startsWith('data:') || item.images[1].startsWith('http') ? item.images[1] : item.images[0])
                        : (item.images && item.images[0] && (item.images[0].startsWith('data:') || item.images[0].startsWith('http'))
                          ? item.images[0]
                          : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNDBDNTAgNDAgMTAgODAgMTAgODBTNTAgMTIwIDEwMCAxMjBTMTkwIDgwIDE5MCA4MFMxNTAgNDAgMTAwIDQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEwMEMxMTAuNDU3IDEwMCAxMTkgOTEuNDU3IDExOSA4MUMxMTkgNzAuNTQzIDExMC40NTcgNjIgMTAwIDYyQzg5LjU0MyA2MiA4MSA3MC41NDMgODEgODFDODEgOTEuNDU3IDg5LjU0MyAxMDAgMTAwIDEwMFoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K')
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNDBDNTAgNDAgMTAgODAgMTAgODBTNTAgMTIwIDEwMCAxMjBTMTkwIDgwIDE5MCA4MFMxNTAgNDAgMTAwIDQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDEwMEMxMTAuNDU3IDEwMCAxMTkgOTEuNDU3IDExOSA4MUMxMTkgNzAuNTQzIDExMC40NTcgNjIgMTAwIDYyQzg5LjU0MyA2MiA4MSA3MC41NDMgODEgODFDODEgOTEuNDU3IDg5LjU0MyAxMDAgMTAwIDEwMFoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0PC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    
                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl text-gray-900 dark:text-white font-medium">
                          <EyeIcon className="w-5 h-5" />
                          View Details
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${
                        item.stock > 0
                          ? 'bg-green-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                      }`}>
                        {item.stock > 0 ? `${item.stock} left` : 'Out of stock'}
                      </div>
                    </div>

                    {/* Multiple Images Indicator */}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-3 left-3">
                        <div className="px-2 py-1 bg-blue-500/90 text-white rounded-lg text-xs font-medium backdrop-blur-md">
                          +{item.images.length - 1} more
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <TagIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.price ? `$${item.price.toFixed(2)}` : `$${item.originalPrice?.toFixed(2)}`}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                            {item.discount}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopDetail;
