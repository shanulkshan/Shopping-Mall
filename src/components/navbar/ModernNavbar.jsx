import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLogo from "../CompanyLogo/CompanyLogo";
import Menu from "./Menu";
import NavbarData from "../../data/NavbarData";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { toast } from "react-toastify";
import { 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
      setIsProfileMenuOpen(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsProfileMenuOpen(false);
  };

  const handleMobileProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="relative z-50">
      {/* Main Navigation */}
      <nav className={`w-full fixed top-0 z-40 ${
        isDarkMode
          ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/30'
          : 'bg-white/95 backdrop-blur-lg border-b border-gray-200/30'
      } transition-colors duration-300`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-24">
            
            {/* Logo */}
            <div className="flex items-center">
              <CompanyLogo
                imageClassName="w-auto h-16 lg:h-20"
                className="mr-4"
                title={NavbarData.title}
                image={{
                  url: NavbarData.logo.image.url,
                  alt: NavbarData.logo.image.alt,
                }}
                link={NavbarData.logo.link}
              />
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <Menu className="flex items-center gap-8" links={NavbarData?.menuItems} />
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Seller Dashboard Button */}
                  {user?.userType === 'seller' && (
                    <a href="/seller/dashboard">
                      <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      }`}>
                        My Shop
                      </button>
                    </a>
                  )}

                  {/* Profile Dropdown */}
                  <div className="relative profile-dropdown-container">
                    <button
                      onClick={toggleProfileMenu}
                      className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                        isDarkMode 
                          ? 'hover:bg-gray-800/50 text-gray-300' 
                          : 'hover:bg-gray-100/50 text-gray-600'
                      } ${isProfileMenuOpen ? 'ring-2 ring-blue-500/50' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="hidden xl:block font-medium">{user?.username}</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div className={`absolute right-0 top-full mt-2 w-56 ${
                        isDarkMode 
                          ? 'bg-gray-900/95 backdrop-blur-lg border border-gray-700/40' 
                          : 'bg-white/95 backdrop-blur-lg border border-gray-200/40'
                      } rounded-2xl shadow-2xl py-2 z-50`}>
                        <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                            isDarkMode 
                              ? 'hover:bg-gray-800/50 text-gray-300' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <UserIcon className="w-5 h-5" />
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                            isDarkMode 
                              ? 'hover:bg-red-900/30 text-red-400' 
                              : 'hover:bg-red-50 text-red-600'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'hover:bg-gray-800/50 text-yellow-400' 
                        : 'hover:bg-gray-100/50 text-gray-600'
                    }`}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  <a href="/register">
                    <button className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}>
                      Sign Up
                    </button>
                  </a>
                  <a href="/login">
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                      Sign In
                    </button>
                  </a>
                  
                  {/* Dark Mode Toggle for non-authenticated users */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'hover:bg-gray-800/50 text-yellow-400' 
                        : 'hover:bg-gray-100/50 text-gray-600'
                    }`}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'hover:bg-gray-800/50 text-yellow-400' 
                    : 'hover:bg-gray-100/50 text-gray-600'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              {/* Hamburger Menu */}
              <button
                onClick={handleMenuOpen}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'hover:bg-gray-800/50 text-gray-300' 
                    : 'hover:bg-gray-100/50 text-gray-600'
                }`}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 z-30 top-[64px] lg:top-[96px] ${
            isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
          } backdrop-blur-lg`}
        >
          <div className="p-8">
            {/* Mobile Navigation Menu */}
            <Menu
              className="flex flex-col gap-1 mb-6"
              linkClassNames={`${
                isDarkMode 
                  ? 'hover:bg-gray-800/50 py-3 px-4 hover:text-blue-400 text-gray-200 rounded-xl' 
                  : 'hover:bg-gray-100/50 py-3 px-4 hover:text-blue-600 text-gray-700 rounded-xl'
              } transition-all`}
              links={NavbarData?.menuItems}
              onLinkClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Action Buttons */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} mb-4`}>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                </div>
                
                {user?.userType === 'seller' && (
                  <a href="/seller/dashboard" onClick={handleMenuOpen}>
                    <button className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                    }`}>
                      My Shop
                    </button>
                  </a>
                )}
                
                <button
                  onClick={handleMobileProfileClick}
                  className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 border border-gray-600/30' 
                      : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-700 border border-gray-300/30'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  My Profile
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    handleMenuOpen();
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a href="/register" onClick={handleMenuOpen}>
                  <button className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/30'
                      : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50 border border-gray-300/30'
                  }`}>
                    Sign Up
                  </button>
                </a>
                <a href="/login" onClick={handleMenuOpen}>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300">
                    Sign In
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernNavbar;
