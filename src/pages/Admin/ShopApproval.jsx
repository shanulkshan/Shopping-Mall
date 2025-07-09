import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDarkMode } from '../../context/DarkModeContext';
import { getImageUrl, getDefaultShopLogo } from '../../utils/imageUtils';
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const ShopApproval = () => {
  const { isDarkMode } = useDarkMode();
  const [pendingShops, setPendingShops] = useState([]);
  const [approvedShops, setApprovedShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    shopId: null,
    reason: ''
  });

  useEffect(() => {
    fetchShops();
  }, [activeTab]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Use the correct admin endpoints
      const endpoint = activeTab === 'pending' ? '/api/shops/admin/pending' : '/api/shops/admin/approved';
      const fullUrl = `http://localhost:3000${endpoint}`;
      
      console.log('Fetching from:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        if (activeTab === 'pending') {
          setPendingShops(data.shops || []);
        } else {
          setApprovedShops(data.shops || []);
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch shops: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error(`Failed to fetch shops: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveShop = async (shopId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/shops/admin/approve/${shopId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Shop approved successfully');
        fetchShops();
      } else {
        throw new Error('Failed to approve shop');
      }
    } catch (error) {
      console.error('Error approving shop:', error);
      toast.error('Failed to approve shop');
    }
  };

  const handleRejectShop = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/shops/admin/reject/${rejectModal.shopId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectModal.reason }),
      });

      if (response.ok) {
        toast.success('Shop rejected successfully');
        setRejectModal({ isOpen: false, shopId: null, reason: '' });
        fetchShops();
      } else {
        throw new Error('Failed to reject shop');
      }
    } catch (error) {
      console.error('Error rejecting shop:', error);
      toast.error('Failed to reject shop');
    }
  };

  const openRejectModal = (shopId) => {
    setRejectModal({ isOpen: true, shopId, reason: '' });
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, shopId: null, reason: '' });
  };

  const ShopCard = ({ shop, isPending }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`${
        isDarkMode 
          ? 'bg-gray-800/70 border-gray-700/30' 
          : 'bg-white/70 border-gray-200/30'
      } backdrop-blur-xl rounded-3xl p-6 border hover:shadow-xl transition-all duration-300`}
    >
      {/* Shop Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Shop Logo */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <img
              src={getImageUrl(shop.shopLogo)}
              alt={shop.shopName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = getDefaultShopLogo();
              }}
            />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
              {shop.shopName}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                shop.isApproved 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {shop.isApproved ? 'Approved' : 'Pending'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {shop.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <UserIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Owner: {shop.sellerId?.username}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <EnvelopeIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {shop.sellerId?.email}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <MapPinIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Floor {shop.floorNumber} | Stall {shop.stallNumber}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <CalendarIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Applied: {new Date(shop.createdAt).toLocaleDateString()}
          </span>
        </div>

        {shop.description && (
          <div className={`p-4 rounded-2xl ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {shop.description}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleApproveShop(shop._id)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-2xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Approve</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openRejectModal(shop._id)}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-3 rounded-2xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
          >
            <XCircleIcon className="w-5 h-5" />
            <span>Reject</span>
          </motion.button>
        </div>
      )}

      {shop.rejectionReason && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-4 p-4 rounded-2xl border ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-800/30 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <p className="text-sm">
            <strong>Rejection Reason:</strong> {shop.rejectionReason}
          </p>
        </motion.div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
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
            Shop Approval Management
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Review and approve shop registration requests
          </p>
        </motion.div>

        <div className={`${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700/30' 
            : 'bg-white/70 border-gray-200/30'
        } backdrop-blur-xl rounded-3xl border shadow-xl`}>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200/20 dark:border-gray-700/20">
            <nav className="flex">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all duration-300 ${
                  activeTab === 'pending'
                    ? `border-blue-500 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
                    : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>Pending Approval</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pendingShops.length}
                  </span>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all duration-300 ${
                  activeTab === 'approved'
                    ? `border-blue-500 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
                    : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Approved Shops</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                  }`}>
                    {approvedShops.length}
                  </span>
                </div>
              </motion.button>
            </nav>
          </div>

          {/* Shop List */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'pending' ? (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {pendingShops.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-16"
                    >
                      <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                      } flex items-center justify-center`}>
                        <ClockIcon className={`w-12 h-12 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-2`}>
                        No pending requests
                      </h3>
                      <p className={`text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        All shop requests have been reviewed.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {pendingShops.map((shop) => (
                        <ShopCard key={shop._id} shop={shop} isPending={true} />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="approved"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {approvedShops.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-16"
                    >
                      <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                      } flex items-center justify-center`}>
                        <CheckCircleIcon className={`w-12 h-12 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } mb-2`}>
                        No approved shops
                      </h3>
                      <p className={`text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No shops have been approved yet.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {approvedShops.map((shop) => (
                        <ShopCard key={shop._id} shop={shop} isPending={false} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md ${
                isDarkMode 
                  ? 'bg-gray-800/95 border-gray-700/50' 
                  : 'bg-white/95 border-gray-200/50'
              } backdrop-blur-xl rounded-3xl border shadow-2xl`}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center">
                    <XCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Reject Shop Application
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Please provide a reason for rejection
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-3`}>
                    Reason for rejection:
                  </label>
                  <textarea
                    value={rejectModal.reason}
                    onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                    className={`w-full p-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    rows="4"
                    placeholder="Please provide a detailed reason for rejecting this shop application..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeRejectModal}
                    className={`flex-1 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRejectShop}
                    disabled={!rejectModal.reason.trim()}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Reject Shop
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopApproval;
