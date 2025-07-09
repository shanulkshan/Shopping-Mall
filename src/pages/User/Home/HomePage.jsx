import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../../context/DarkModeContext";
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  ShoppingBagIcon,
  GiftIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  FireIcon,
  TagIcon,
  TruckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const { isDarkMode } = useDarkMode();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Hero carousel data with more dynamic content
  const heroSlides = [
    {
      title: "Welcome to Serendib Plaza",
      subtitle: "Your Ultimate Shopping Destination",
      description: "Discover 50+ premium stores, exclusive deals, and unmatched shopping experience in the heart of the city",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Explore Stores",
      accent: "from-blue-600 to-purple-600",
      badge: "New Arrivals"
    },
    {
      title: "Fashion & Lifestyle Hub",
      subtitle: "Style Meets Elegance",
      description: "From haute couture to everyday essentials, find your perfect style with top international and local brands",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop",
      cta: "Shop Fashion",
      accent: "from-pink-500 to-rose-600",
      badge: "Trending Now"
    },
    {
      title: "Tech & Innovation Center",
      subtitle: "Future is Here",
      description: "Experience the latest in technology, electronics, and smart devices from world's leading brands",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop",
      cta: "Discover Tech",
      accent: "from-cyan-500 to-blue-600",
      badge: "Latest Tech"
    },
    {
      title: "Dining & Entertainment",
      subtitle: "Taste & Fun Combined",
      description: "Enjoy world-class dining, entertainment, and leisure activities all under one magnificent roof",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop",
      cta: "Explore Dining",
      accent: "from-orange-500 to-red-600",
      badge: "Food Court"
    }
  ];

  // Enhanced categories with more details
  const categories = [
    {
      name: "Fashion & Apparel",
      description: "Latest trends and timeless classics",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
      color: "from-pink-500 to-rose-600",
      count: "15+ Stores",
      popular: "Most Popular"
    },
    {
      name: "Electronics & Tech",
      description: "Cutting-edge technology and gadgets",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-600",
      count: "12+ Stores",
      popular: "New Arrivals"
    },
    {
      name: "Home & Living",
      description: "Beautiful decor and furniture",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-600",
      count: "8+ Stores",
      popular: "Trending"
    },
    {
      name: "Beauty & Wellness",
      description: "Premium cosmetics and skincare",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
      color: "from-purple-500 to-pink-600",
      count: "10+ Stores",
      popular: "Luxury Brands"
    },
    {
      name: "Sports & Fitness",
      description: "Athletic wear and equipment",
      image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=400&h=300&fit=crop",
      color: "from-orange-500 to-yellow-600",
      count: "6+ Stores",
      popular: "Active Wear"
    },
    {
      name: "Books & Media",
      description: "Knowledge and entertainment",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      color: "from-indigo-500 to-purple-600",
      count: "4+ Stores",
      popular: "Bestsellers"
    }
  ];

  // Customer testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content: "This mall has completely transformed my shopping experience. The variety and quality are unmatched!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Tech Professional",
      content: "Found everything I needed for my home office setup. Great selection and competitive prices!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Interior Designer",
      content: "The home decor stores here are fantastic. Always find unique pieces for my projects.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  // Mall statistics
  const stats = [
    { number: "50+", label: "Premium Stores" },
    { number: "1000+", label: "Products" },
    { number: "50K+", label: "Happy Customers" },
    { number: "4.9", label: "Customer Rating" }
  ];

  // Auto-scroll hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate featured categories
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      
      {/* Hero Section with Dynamic Carousel */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-4xl mx-auto text-white"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-6 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-md"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">New Collection Available</span>
                </motion.div>
                
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mb-6 text-5xl font-bold leading-tight md:text-7xl"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mb-4 text-xl font-medium md:text-2xl"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="max-w-2xl mx-auto mb-8 text-lg opacity-90"
                >
                  {heroSlides[currentSlide].description}
                </motion.p>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <a href="/shops">
                    <button className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-300 bg-white rounded-2xl hover:bg-gray-100 hover:scale-105 active:scale-95">
                      {heroSlides[currentSlide].cta}
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </a>
                  <a href="/promotions">
                    <button className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border bg-white/20 backdrop-blur-md rounded-2xl border-white/30 hover:bg-white/30 hover:scale-105 active:scale-95">
                      <GiftIcon className="w-5 h-5" />
                      View Promotions
                    </button>
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute z-20 flex gap-3 transform -translate-x-1/2 bottom-8 left-1/2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="relative py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              { number: "50+", label: "Premium Stores", icon: ShoppingBagIcon },
              { number: "10K+", label: "Happy Customers", icon: StarIcon },
              { number: "1000+", label: "Quality Products", icon: GiftIcon },
              { number: "24/7", label: "Customer Support", icon: ClockIcon }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-6 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/30' 
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/30'
                } hover:shadow-xl transition-all duration-300`}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-4 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories with Dynamic Animation */}
      <section className="relative py-20 overflow-hidden">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Explore Our <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Categories</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover amazing products across different categories, each carefully curated for quality and style
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="cursor-pointer group"
              >
                <div className={`relative overflow-hidden rounded-3xl ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/30' 
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/30'
                } hover:shadow-2xl transition-all duration-500`}>
                  <div className="relative overflow-hidden aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="relative p-6">
                    <div className="absolute -top-6 left-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                        <ShoppingBagIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="pt-8">
                      <h3 className={`text-xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.name}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {category.description}
                      </p>
                      <div className={`text-xs font-medium ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {category.count}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Mall Features */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Why Choose <span className="text-transparent bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text">Serendib Plaza?</span>
              </h2>
              <p className={`text-lg mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Experience the best of shopping with our carefully selected stores, exclusive deals, and exceptional customer service.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Premium Quality", desc: "Only the finest products from trusted brands" },
                  { title: "Exclusive Deals", desc: "Special offers and promotions just for you" },
                  { title: "Secure Shopping", desc: "Safe and secure browsing experience" },
                  { title: "Expert Curation", desc: "Hand-picked items by our shopping experts" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-gradient-to-r from-green-500 to-blue-600">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop"
                  alt="Shopping Experience"
                  className="object-cover w-full h-96"
                />
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute p-4 shadow-lg top-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl"
                >
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">4.9 Rating</span>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute p-4 shadow-lg bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl"
                >
                  <div className="flex items-center gap-2">
                    <GiftIcon className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-900">Free Delivery</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter & Contact Section */}
      <section className={`py-20 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50'
      }`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Stay Connected
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get the latest updates on new arrivals, exclusive deals, and special events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: MapPinIcon,
                title: "Visit Our Mall",
                desc: "123 Shopping Street, Downtown City",
                action: "Get Directions"
              },
              {
                icon: PhoneIcon,
                title: "Contact Us",
                desc: "+1 (555) 123-4567",
                action: "Call Now"
              },
              {
                icon: ClockIcon,
                title: "Opening Hours",
                desc: "Mon-Sun: 10AM - 10PM",
                action: "View Schedule"
              }
            ].map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`text-center p-8 rounded-3xl ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/30' 
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/30'
                } hover:shadow-xl transition-all duration-300`}
              >
                <contact.icon className={`w-12 h-12 mx-auto mb-4 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {contact.title}
                </h3>
                <p className={`text-sm mb-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {contact.desc}
                </p>
                <button className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  {contact.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
