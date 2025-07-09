import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { apiEndpoint } from '../../utils/api.js';
import {
  PlusIcon,
  PhotoIcon,
  XMarkIcon,
  TagIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const AddItem = () => {
  const { isDarkMode } = useDarkMode();
  const { itemId } = useParams(); // Get itemId from URL params
  const isEditing = !!itemId; // Determine if we're editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    stock: '',
    size: '',
    color: '',
    brand: '',
    material: '',
    weight: '',
    dimensions: '',
    tags: '',
    images: []
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(isEditing);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { name: 'Clothing', icon: '👕', color: 'from-pink-500 to-rose-500' },
    { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { name: 'Books', icon: '📚', color: 'from-green-500 to-emerald-500' },
    { name: 'Beauty', icon: '💄', color: 'from-purple-500 to-pink-500' },
    { name: 'Home & Garden', icon: '🏠', color: 'from-orange-500 to-yellow-500' },
    { name: 'Sports', icon: '⚽', color: 'from-red-500 to-orange-500' },
    { name: 'Toys', icon: '🧸', color: 'from-indigo-500 to-purple-500' },
    { name: 'Food', icon: '🍕', color: 'from-yellow-500 to-orange-500' },
    { name: 'Accessories', icon: '⌚', color: 'from-teal-500 to-cyan-500' },
    { name: 'Other', icon: '🛍️', color: 'from-gray-500 to-gray-600' }
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Product name, category & description' },
    { number: 2, title: 'Details', description: 'Pricing, stock & specifications' },
    { number: 3, title: 'Images', description: 'Upload product photos' }
  ];

  // Fetch existing item data if editing
  useEffect(() => {
    if (isEditing && itemId) {
      fetchItemData();
    }
  }, [isEditing, itemId]);

  const fetchItemData = async () => {
    try {
      setFetchingItem(true);
      const response = await fetch(apiEndpoint(`/item/${itemId}`), {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const item = data.item;
        
        // Populate form with existing data
        setFormData({
          name: item.name || '',
          description: item.description || '',
          originalPrice: item.originalPrice?.toString() || '',
          category: item.category || '',
          subcategory: item.subcategory || '',
          stock: item.stock?.toString() || '',
          size: item.size || '',
          color: item.color || '',
          brand: item.brand || '',
          material: item.material || '',
          weight: item.weight || '',
          dimensions: item.dimensions || '',
          tags: item.tags?.join(', ') || '',
          images: [] // We'll handle existing images separately
        });

        // Set image previews if item has existing images
        if (item.images && item.images.length > 0) {
          setImagePreviews(item.images);
        }

        toast.success('Item data loaded successfully');
      } else {
        toast.error('Failed to load item data');
        navigate('/seller/dashboard');
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
      toast.error('Failed to load item data');
      navigate('/seller/dashboard');
    } finally {
      setFetchingItem(false);
    }
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (typeof preview === 'string' && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  // Handle image reordering
  const handleImageReorder = (newOrder) => {
    setImagePreviews(newOrder);
    // Reorder corresponding files if they exist
    if (imageFiles.length > 0) {
      const newFiles = newOrder.map((preview, index) => {
        const originalIndex = imagePreviews.indexOf(preview);
        return originalIndex !== -1 ? imageFiles[originalIndex] : null;
      }).filter(Boolean);
      setImageFiles(newFiles);
      setFormData(prev => ({ ...prev, images: newFiles }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const fileArray = Array.from(files);
      
      // Limit to 5 images
      if (fileArray.length > 5) {
        toast.warning('You can upload a maximum of 5 images');
        return;
      }
      
      // Validate file types and sizes
      const validFiles = [];
      const invalidFiles = [];
      
      fileArray.forEach(file => {
        if (file.type.startsWith('image/')) {
          if (file.size <= 5 * 1024 * 1024) { // 5MB limit
            validFiles.push(file);
          } else {
            invalidFiles.push(`${file.name} (too large - max 5MB)`);
          }
        } else {
          invalidFiles.push(`${file.name} (not an image)`);
        }
      });
      
      if (invalidFiles.length > 0) {
        toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
      }
      
      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: validFiles
        }));
        
        setImageFiles(validFiles);
        
        // Create image previews
        const previews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        
        if (validFiles.length < fileArray.length) {
          toast.success(`${validFiles.length} of ${fileArray.length} images uploaded successfully`);
        } else {
          toast.success(`${validFiles.length} image(s) uploaded successfully`);
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.description || !formData.originalPrice || 
        !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (parseFloat(formData.originalPrice) <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }

    if (parseInt(formData.stock) < 0) {
      toast.error('Stock cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow submission when on step 3 (final step)
    if (currentStep !== 3) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for submission
      const submitData = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        price: parseFloat(formData.originalPrice), // Set initial price same as original price
        discount: 0, // Default discount
        stock: parseInt(formData.stock),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      // Handle images - for editing, only include new images if any were uploaded
      if (isEditing) {
        if (imageFiles.length > 0) {
          // New images were uploaded, convert them to base64 in correct order
          submitData.images = await Promise.all(imageFiles.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.readAsDataURL(file);
            });
          }));
        } else {
          // No new images, keep existing images (use imagePreviews for existing images)
          submitData.images = imagePreviews;
        }
      } else {
        // Creating new item - convert images to base64 or use default
        submitData.images = imageFiles.length > 0 
          ? await Promise.all(imageFiles.map(file => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
              });
            }))
          : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBDNjggOTAgOCAxNTAgOCAxNTBTNjggMjEwIDE1MCAyMTBTMjkyIDE1MCAyOTIgMTUwUzIzMiA5MCAxNTAgOTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNTAgMTcyLjVDMTYyLjQyNiAxNzIuNSAxNzIuNSAxNjIuNDI2IDE3Mi41IDE1MEMxNzIuNSAxMzcuNTc0IDE2Mi40MjYgMTI3LjUgMTUwIDEyNy41QzEzNy41NzQgMTI3LjUgMTI3LjUgMTM3LjU3NCAxMjcuNSAxNTBDMTI3LjUgMTYyLjQyNiAxMzcuNTc0IDE7Mi41IDE1MCAxNzIuNVoiIGZpbGw9IiM2MzY5NzUiLz4KPHR4dCB4PSIxNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2OTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdHh0Pgo8L3N2Zz4K'];
      }

      // Determine endpoint and method based on whether we're editing or creating
      const endpoint = isEditing 
        ? apiEndpoint(`/item/${itemId}`)
        : apiEndpoint('/item/create');
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast.success(isEditing ? 'Item updated successfully!' : 'Item added successfully!');
        navigate('/seller/dashboard');
      } else {
        const data = await response.json();
        toast.error(data.message || (isEditing ? 'Failed to update item' : 'Failed to add item'));
      }
    } catch (error) {
      toast.error(isEditing ? 'Failed to update item. Please try again.' : 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.userType !== 'seller') {
    navigate('/');
    return null;
  }

  // Show loading state when fetching item data for editing
  if (fetchingItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Product Data</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch the product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
            {isEditing ? <PencilIcon className="w-8 h-8 text-white" /> : <PlusIcon className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isEditing 
              ? 'Update your product details and reach even more customers' 
              : 'Create a new listing for your shop and reach thousands of customers'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${
                        currentStep >= step.number
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 max-w-24">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-green-500 to-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
        >
          <form 
            onSubmit={handleSubmit} 
            onKeyDown={(e) => {
              // Prevent form submission via Enter key unless on step 3
              if (e.key === 'Enter' && currentStep !== 3) {
                e.preventDefault();
              }
            }}
            className="p-8"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Basic Product Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Let's start with the essential details about your product
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <TagIcon className="w-4 h-4 inline mr-1" />
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                        placeholder="Enter an attractive product name"
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Product Category *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {categories.map((category) => (
                          <button
                            key={category.name}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                              formData.category === category.name
                                ? `border-blue-500 bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-400'
                            }`}
                          >
                            <div className="text-2xl mb-2">{category.icon}</div>
                            <div className={`text-sm font-medium ${
                              formData.category === category.name
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {category.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Description *
                      </label>
                      <textarea
                        name="description"
                        rows={5}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe your product in detail. Include features, benefits, and what makes it special..."
                      />
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {formData.description.length}/500 characters
                      </div>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subcategory (Optional)
                      </label>
                      <input
                        type="text"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., T-shirts, Smartphones, Fiction Books"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Pricing and Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Pricing & Product Details
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Set your pricing and add detailed specifications
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="originalPrice"
                          required
                          value={formData.originalPrice}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <ArchiveBoxIcon className="w-4 h-4 inline mr-1" />
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          name="stock"
                          required
                          value={formData.stock}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter brand name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Color
                        </label>
                        <input
                          type="text"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter color"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size
                        </label>
                        <input
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., S, M, L, XL"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Weight
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., 500g, 1.2kg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., 10x20x5 cm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., Cotton, Plastic, Metal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., summer, casual, trending, bestseller"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Images */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Product Images
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {isEditing 
                        ? 'Your current images are shown below. Upload new images to replace them, or keep existing ones and click "Update Product".'
                        : 'Upload high-quality images to showcase your product (up to 5 images)'
                      }
                    </p>
                    {isEditing && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
                          <InformationCircleIcon className="w-5 h-5" />
                          <span className="font-medium">
                            Click "Update Product" below to save your changes
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <div className="mb-4">
                        <label htmlFor="images" className="block">
                          <span className="text-lg font-medium text-gray-900 dark:text-white mb-2 block">
                            Upload Product Images
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-4">
                            Upload up to 5 high-quality images (JPG, PNG, GIF)
                          </span>
                          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                            <PhotoIcon className="w-5 h-5" />
                            Choose Images
                          </div>
                        </label>
                        <input
                          type="file"
                          id="images"
                          name="images"
                          multiple
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Image Previews ({imagePreviews.length}/5)
                          </h4>
                          <div className="flex gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                              Drag to reorder
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreviews([]);
                                setImageFiles([]);
                                setFormData(prev => ({ ...prev, images: [] }));
                              }}
                              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                        
                        <Reorder.Group 
                          axis="x" 
                          values={imagePreviews} 
                          onReorder={handleImageReorder}
                          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                        >
                          {imagePreviews.map((preview, index) => (
                            <Reorder.Item
                              key={preview}
                              value={preview}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                              className="relative group cursor-grab active:cursor-grabbing"
                              whileDrag={{ scale: 1.05, zIndex: 10 }}
                            >
                              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-800">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover pointer-events-none"
                                  draggable={false}
                                />
                              </div>
                              
                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                  const newFiles = imageFiles.filter((_, i) => i !== index);
                                  setImagePreviews(newPreviews);
                                  setImageFiles(newFiles);
                                  setFormData(prev => ({ ...prev, images: newFiles }));
                                  toast.success('Image removed');
                                }}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-20"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                              
                              {/* Position indicator */}
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                                {index === 0 ? 'Main' : index + 1}
                              </div>
                              
                              {/* Primary badge */}
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg">
                                  Primary
                                </div>
                              )}
                              
                              {/* Drag handle indicator */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-6 h-6 bg-gray-800/70 rounded-lg flex items-center justify-center">
                                  <div className="grid grid-cols-2 gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                      <div key={i} className="w-1 h-1 bg-white rounded-full" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                        
                        {/* Add more images button */}
                        {imagePreviews.length < 5 && (
                          <motion.label
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: imagePreviews.length * 0.1 }}
                            htmlFor="images"
                            className="mt-4 aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group max-w-32 mx-auto"
                          >
                            <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 mt-2 font-medium">
                              Add More
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {5 - imagePreviews.length} remaining
                            </span>
                          </motion.label>
                        )}
                      </div>
                    )}

                    {/* Tips */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            Image Tips for Better Sales
                          </h5>
                          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                            <li>• Use high-resolution images (at least 800x800 pixels)</li>
                            <li>• Show the product from multiple angles</li>
                            <li>• Include lifestyle shots showing the product in use</li>
                            <li>• Ensure good lighting and clear backgrounds</li>
                            <li>• First image should be the main product photo</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/seller/dashboard')}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-2xl transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any form submission
                      
                      if (currentStep === 1 && (!formData.name || !formData.category || !formData.description)) {
                        toast.error('Please fill in all required fields before continuing');
                        return;
                      }
                      if (currentStep === 2 && (!formData.originalPrice || !formData.stock)) {
                        toast.error('Please fill in price and stock before continuing');
                        return;
                      }
                      
                      // Move to next step
                      setCurrentStep(prev => prev + 1);
                      
                      // Show informational message when reaching image step in edit mode
                      if (currentStep === 2 && isEditing) {
                        setTimeout(() => {
                          toast.info('You can upload new images or keep the existing ones. Click "Update Product" when ready.');
                        }, 300);
                      }
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        {isEditing 
                          ? (formData.images.length > 0 ? 'Processing Images...' : 'Updating Product...') 
                          : (formData.images.length > 0 ? 'Processing Images...' : 'Creating Product...')
                        }
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isEditing ? <PencilIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                        {isEditing ? 'Update Product' : 'Create Product'}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItem;
