import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../context/DarkModeContext';
import { toast } from 'react-toastify';
import { apiEndpoint } from '../../../utils/api.js';
import {
  ArrowLeftIcon,
  StarIcon,
  TagIcon,
  CubeIcon,
  ScaleIcon,
  RectangleStackIcon,
  SwatchIcon,
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ShareIcon,
  HeartIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

const ProductDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint(`/item/${itemId}`));
      
      if (response.ok) {
        const data = await response.json();
        setItem(data.item);
        if (data.item.size) setSelectedSize(data.item.size);
        if (data.item.color) setSelectedColor(data.item.color);
      } else {
        toast.error('Product not found');
        navigate('/shops');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load product details');
      navigate('/shops');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (item?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (item?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: item.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
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

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/shops')}
            className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
          >
            Browse Shops
          </button>
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
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to Shop</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={item.images && item.images.length > 0 
                    ? item.images[currentImageIndex] 
                    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTIwQzEyMCAxMjAgNjAgMTgwIDYwIDE4MFMxMjAgMjQwIDIwMCAyNDBTMzQwIDE4MCAzNDAgMTgwUzI4MCAxMjAgMjAwIDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwMCAyMDBDMjEyLjQyNiAyMDAgMjIyLjUgMTg5LjkyNiAyMjIuNSAxNzcuNUMyMjIuNSAxNjUuMDc0IDIxMi40MjYgMTU1IDIwMCAxNTVDMTg3LjU3NCAxNTUgMTc3LjUgMTY1LjA3NCAxNzcuNSAxNzcuNUMxNzcuNSAxODkuOTI2IDE4Ny41NzQgMjAwIDIwMCAyMDBaIiBmaWxsPSIjNjM2OTc1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2MzY5NzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
                  }
                  alt={item.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setIsImageModalOpen(true)}
                />
                
                {/* Image Navigation */}
                {item.images && item.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {item.images.length}
                    </div>
                  </>
                )}

                {/* Zoom Icon */}
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'border-blue-500 shadow-lg scale-110'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
              
              {/* Category */}
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              {/* Title and Actions */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {item.name}
                </h1>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <ShareIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Brand */}
              {item.brand && (
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-4">
                  by {item.brand}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  ${item.price?.toFixed(2) || item.originalPrice?.toFixed(2)}
                </span>
                {item.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${item.originalPrice?.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                      {item.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(4.5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  4.5 (128 reviews)
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <CubeIcon className="w-5 h-5 text-green-500" />
                <span className={`text-sm font-medium ${
                  item.stock > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.size && (
                  <div className="flex items-center gap-3">
                    <RectangleStackIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Size</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.size}</span>
                    </div>
                  </div>
                )}
                {item.color && (
                  <div className="flex items-center gap-3">
                    <SwatchIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Color</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.color}</span>
                    </div>
                  </div>
                )}
                {item.weight && (
                  <div className="flex items-center gap-3">
                    <ScaleIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Weight</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.weight}</span>
                    </div>
                  </div>
                )}
                {item.material && (
                  <div className="flex items-center gap-3">
                    <CubeIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Material</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.material}</span>
                    </div>
                  </div>
                )}
                {item.dimensions && (
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <RectangleStackIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Dimensions</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.dimensions}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Store Information */}
            {item.shopId && (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.shopId.shopName || 'Store'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Floor {item.shopId.floorNumber} - Stall {item.shopId.stallNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/shop/${item.shopId._id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                  >
                    Visit Store
                  </button>
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.images && item.images.length > 0 
                  ? item.images[currentImageIndex] 
                  : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTIwQzEyMCAxMjAgNjAgMTgwIDYwIDE4MFMxMjAgMjQwIDIwMCAyNDBTMzQwIDE4MCAzNDAgMTgwUzI4MCAxMjAgMjAwIDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwMCAyMDBDMjEyLjQyNiAyMDAgMjIyLjUgMTg5LjkyNiAyMjIuNSAxNzcuNUMyMjIuNSAxNjUuMDc0IDIxMi40MjYgMTU1IDIwMCAxNTVDMTg3LjU3NCAxNTUgMTc3LjUgMTY1LjA3NCAxNzcuNSAxNzcuNUMxNzcuNSAxODkuOTI2IDE4Ny41NzQgMjAwIDIwMCAyMDBaIiBmaWxsPSIjNjM2OTc1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2MzY5NzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
                }
                alt={item.name}
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              {/* Navigation in Modal */}
              {item.images && item.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeftIcon className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRightIcon className="w-8 h-8" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
