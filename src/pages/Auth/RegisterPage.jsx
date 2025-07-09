import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  SparklesIcon,
  PhotoIcon,
  CheckCircleIcon,
  MapPinIcon,
  TagIcon
} from "@heroicons/react/24/outline";

const RegisterPage = () => {
  const [userType, setUserType] = useState('customer');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Seller-specific fields
    shopName: "",
    category: "",
    stallNumber: "",
    floorNumber: "",
    description: "",
    shopLogo: null
  });
  
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const categories = [
    { value: "", label: "Select Category" },
    { value: "Cloth", label: "Clothing & Fashion" },
    { value: "Beauty", label: "Beauty & Cosmetics" },
    { value: "Book", label: "Books & Stationery" },
    { value: "Food", label: "Food & Beverages" },
    { value: "Tech", label: "Technology & Electronics" },
    { value: "Other", label: "Other" }
  ];

  const floors = [
    { value: "", label: "Select Floor" },
    { value: "G", label: "Ground Floor (G)" },
    { value: "L1", label: "Level 1 (L1)" },
    { value: "L2", label: "Level 2 (L2)" },
    { value: "L3", label: "Level 3 (L3)" },
    { value: "L5", label: "Level 5 (L5)" }
  ];

  // Generate stall numbers based on selected floor
  const getStallNumbers = (floorCode) => {
    if (!floorCode) return [{ value: "", label: "Select Floor First" }];
    
    const stalls = [{ value: "", label: "Select Stall" }];
    for (let i = 1; i <= 10; i++) {
      const stallNumber = `${floorCode}-${i.toString().padStart(2, '0')}`;
      stalls.push({ value: stallNumber, label: `Stall ${stallNumber}` });
    }
    return stalls;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (userType === 'seller') {
      if (!formData.shopName || !formData.category || !formData.stallNumber || 
          !formData.floorNumber || !formData.description) {
        toast.error("Please fill in all shop details");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('userType', userType);

      if (userType === 'seller') {
        formDataToSend.append('shopName', formData.shopName);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stallNumber', formData.stallNumber);
        formDataToSend.append('floorNumber', formData.floorNumber);
        formDataToSend.append('description', formData.description);
        
        // Add shop logo if selected
        if (formData.shopLogo) {
          formDataToSend.append('shopLogo', formData.shopLogo);
        }
      }

      const result = await register(formDataToSend, true); // Pass true for FormData
      
      if (result.success) {
        toast.success("Registration successful! Please wait for approval if you're a seller.");
        navigate("/login");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.username && formData.email;
    } else if (currentStep === 2) {
      return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    }
    return true;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'
    } transition-colors duration-300`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/10'
        } blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/10'
        } blur-3xl`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full ${
          isDarkMode ? 'bg-pink-500/5' : 'bg-pink-500/5'
        } blur-3xl`} />
      </div>

      <div className="relative w-full max-w-md">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6 shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Join Our Mall
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create your account to get started
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white scale-110'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-400' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600'
                        : isDarkMode 
                          ? 'bg-gray-700' 
                          : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-16 text-xs">
              <span className={currentStep >= 1 ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                Account
              </span>
              <span className={currentStep >= 2 ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                Security
              </span>
              <span className={currentStep >= 3 ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                {userType === 'seller' ? 'Shop Details' : 'Complete'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`${
            isDarkMode 
              ? 'bg-gray-800/40 backdrop-blur-xl border-gray-700/50' 
              : 'bg-white/40 backdrop-blur-xl border-white/50'
          } rounded-3xl shadow-2xl border p-8`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info & User Type */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* User Type Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      I want to register as:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'customer', label: 'Customer', icon: ShoppingBagIcon, desc: 'Shop and discover' },
                        { value: 'seller', label: 'Shop Owner', icon: BuildingStorefrontIcon, desc: 'Sell products' }
                      ].map((type) => (
                        <motion.button
                          key={type.value}
                          type="button"
                          onClick={() => setUserType(type.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                            userType === type.value
                              ? 'border-purple-500 bg-purple-500/10'
                              : isDarkMode
                                ? 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                                : 'border-gray-300 hover:border-gray-400 bg-white/30'
                          }`}
                        >
                          <type.icon className={`w-6 h-6 mb-2 ${
                            userType === type.value
                              ? 'text-purple-500'
                              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <div className={`font-semibold mb-1 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {type.label}
                          </div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {type.desc}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className={`h-5 w-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300`}
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className={`h-5 w-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className={`h-5 w-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                          } transition-colors`} />
                        ) : (
                          <EyeIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                          } transition-colors`} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className={`h-5 w-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300 ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                          } transition-colors`} />
                        ) : (
                          <EyeIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                          } transition-colors`} />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-2 text-sm text-red-500">Passwords do not match</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Shop Details (for sellers) or Complete (for customers) */}
              {currentStep === 3 && userType === 'seller' && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Shop Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Shop Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingStorefrontIcon className={`h-5 w-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        name="shopName"
                        required
                        value={formData.shopName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300`}
                        placeholder="Enter your shop name"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className={`h-5 w-5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300`}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value} className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Floor and Stall */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Floor
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <select
                          name="floorNumber"
                          required
                          value={formData.floorNumber}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                            isDarkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                              : 'bg-white/50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
                          } focus:ring-4 transition-all duration-300`}
                        >
                          {floors.map((floor) => (
                            <option key={floor.value} value={floor.value} className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
                              {floor.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Stall
                      </label>
                      <select
                        name="stallNumber"
                        required
                        value={formData.stallNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-2xl border ${
                          isDarkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
                        } focus:ring-4 transition-all duration-300`}
                      >
                        {getStallNumbers(formData.floorNumber).map((stall) => (
                          <option key={stall.value} value={stall.value} className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
                            {stall.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Shop Description
                    </label>
                    <textarea
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                          : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                      } focus:ring-4 transition-all duration-300 resize-none`}
                      placeholder="Describe your shop and products..."
                    />
                  </div>

                  {/* Shop Logo */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Shop Logo (Optional)
                    </label>
                    <div className={`relative border-2 border-dashed rounded-2xl p-6 ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    } transition-colors duration-300`}>
                      <input
                        type="file"
                        name="shopLogo"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        <PhotoIcon className={`mx-auto h-12 w-12 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                        <div className="mt-4">
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {formData.shopLogo ? formData.shopLogo.name : 'Click to upload or drag and drop'}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                      {formData.shopLogo && (
                        <div className="mt-4">
                          <img
                            src={URL.createObjectURL(formData.shopLogo)}
                            alt="Shop logo preview"
                            className="mx-auto h-20 w-20 object-cover rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && userType === 'customer' && (
                <motion.div
                  key="step3-customer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6 shadow-lg">
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Almost Done!
                  </h3>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Click below to complete your registration and start shopping!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
              >
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </motion.button>
              )}

              <div className="flex-1 flex justify-end">
                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <CheckCircleIcon className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={`font-semibold ${
                  isDarkMode 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-purple-600 hover:text-purple-500'
                } transition-colors`}
              >
                Sign in here
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className={`h-5 w-5 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Shop
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BuildingStorefrontIcon className={`h-5 w-5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Sell
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className={`h-5 w-5 ${
                isDarkMode ? 'text-pink-400' : 'text-pink-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Discover
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
