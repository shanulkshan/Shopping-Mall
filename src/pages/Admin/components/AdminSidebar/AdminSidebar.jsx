import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { useDarkMode } from "../../../../context/DarkModeContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  GiftIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";

const AdminSidebar = ({ children }) => {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const menus = [
    {
      name: 'Dashboard',
      link: '/admin/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Shop Approval',
      link: '/admin/shop-approval',
      icon: BuildingStorefrontIcon
    },
    {
      name: 'Promotions',
      link: '/admin/promotion-list',
      icon: GiftIcon
    },
    {
      name: 'Analytics',
      link: '/admin/analytics',
      icon: ChartBarIcon
    },
    {
      name: 'Create Admin',
      link: '/admin/create-admin',
      icon: UserPlusIcon
    }
  ];

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-50 w-72 ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        } backdrop-blur-xl border-r lg:translate-x-0 lg:static lg:inset-0`}
      >
        
        {/* Logo & Brand */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <BuildingStorefrontIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mall Admin
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Management Portal
              </p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 transition-colors lg:hidden rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.username || 'Admin User'}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                System Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <nav className="space-y-2">
            {menus.map((menu, index) => {
              const isActive = location.pathname === menu.link;
              return (
                <motion.div
                  key={menu.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <NavLink
                    to={menu.link}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 group
                      ${isActive 
                        ? `${isDarkMode 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          }` 
                        : `${isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`
                      }
                    `}
                  >
                    <menu.icon className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span>{menu.name}</span>
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-3 border-t border-gray-200/20 dark:border-gray-700/20">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Settings */}
          <Link
            to="/admin/settings"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 space-x-3 font-medium text-red-500 transition-all duration-200 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Header */}
        <header className={`${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        } backdrop-blur-xl border-b px-6 py-4 lg:px-8`}>
          <div className="flex items-center justify-between">
            
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 transition-colors lg:hidden rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Page title */}
            <div className="hidden lg:block">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {location.pathname.includes('dashboard') && 'Dashboard'}
                {location.pathname.includes('shop-approval') && 'Shop Approval'}
                {location.pathname.includes('promotion') && 'Promotions'}
                {location.pathname.includes('analytics') && 'Analytics'}
              </h2>
            </div>

            {/* Quick actions */}
            <div className="flex items-center space-x-3">
              <Link
                to="/shops"
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                View Store
              </Link>
              <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;
