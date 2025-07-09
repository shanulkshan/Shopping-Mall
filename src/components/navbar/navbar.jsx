import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLogo from "../CompanyLogo/CompanyLogo";
import Menu from "./Menu";
import Button from "../Button/Button";
import NavbarData from "../../data/NavbarData";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { toast } from "react-toastify";
import { 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  HeartIcon,
  BellIcon
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    await logout();
    toast.success("Logged out successfully");
    setIsProfileMenuOpen(false);
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
    <div className="relative z-40 animate-fade">
      <nav className="z-40 w-full fixed top-4 px-4">
        <div
          className={`${
            !isMenuOpen === true 
              ? isDarkMode 
                ? "bg-gray-900/20 backdrop-blur-md border border-gray-700/30" 
                : "bg-white/10 backdrop-blur-md border border-white/20"
              : isDarkMode
                ? "bg-gray-900/90 backdrop-blur-md border border-gray-700/40"
                : "bg-white/90 backdrop-blur-md border border-white/30"
          } ${
            scrolled 
              ? isDarkMode
                ? "bg-gray-900/30 backdrop-blur-lg shadow-lg border border-gray-700/40 py-3"
                : "bg-white/20 backdrop-blur-lg shadow-lg border border-white/30 py-3"
              : isDarkMode
                ? "bg-gray-900/20 backdrop-blur-md border border-gray-700/30 py-5"
                : "bg-white/10 backdrop-blur-md border border-white/20 py-5"
          } transition-all duration-700 ease-in-out rounded-2xl shadow-xl`}
        >

      {/* Menu for Large screen */}
        <div className="flex flex-row items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="inline-flex items-center">
            <CompanyLogo
              imageClassName="w-auto"
              className="mr-8"
              size={NavbarData.logo.size}
              image={{
                url: NavbarData.logo.image.url,
                alt: NavbarData.logo.image.alt,
              }}
              link={NavbarData.logo.link}
            />
          </div>

          <div className="items-center hidden gap-2 md:flex">
            <Menu className="hidden md:flex" links={NavbarData?.menuItems} />
          </div>
          <div className="items-center hidden gap-2 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Welcome, {user?.username}
                </span>
                {user?.userType === 'seller' && (
                  <a href="/seller/dashboard" className="flex gap-2">
                    <Button 
                      bgColor="transparent linear-gradient(105deg, #3b82f6 0%, #1d4ed8 100%) 0% 0% no-repeat padding-box"
                      hoverColor="transparent linear-gradient(105deg, #1d4ed8 0%, #3b82f6 100%) 0% 0% no-repeat padding-box"
                    >
                      My Shop
                    </Button>
                  </a>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={toggleProfileMenu}
                    className={`p-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 border border-gray-600/30' 
                        : 'bg-gray-100/50 hover:bg-gray-200/70 text-gray-700 border border-gray-300/30'
                    } ${isProfileMenuOpen ? 'ring-2 ring-blue-500/50' : ''}`}
                    title="Profile Menu"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-48 ${
                      isDarkMode 
                        ? 'bg-gray-900/90 backdrop-blur-md border border-gray-700/40' 
                        : 'bg-white/90 backdrop-blur-md border border-white/30'
                    } rounded-xl shadow-xl py-2 z-50`}>
                      <button
                        onClick={handleProfileClick}
                        className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                          isDarkMode 
                            ? 'hover:bg-gray-700/50 text-gray-200' 
                            : 'hover:bg-gray-100/70 text-gray-700'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        Profile
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
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/70 text-yellow-400 border border-gray-600/30' 
                      : 'bg-gray-100/50 hover:bg-gray-200/70 text-gray-600 border border-gray-300/30'
                  }`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <>
                <a href={"/register"} className="flex gap-2 ">
                  <Button
                    bgColor="transparent linear-gradient(105deg, #e9ad0d 0%, #e15603 100%) 0% 0% no-repeat padding-box"
                    hoverColor="transparent linear-gradient(105deg, #e15603 0%, #e9ad0d 100%) 0% 0% no-repeat padding-box"
                  >
                    Register
                  </Button>
                </a>
                <a href={"/login"} className="flex gap-2 ">
                  <Button>Login</Button>
                </a>
                
                {/* Dark Mode Toggle for non-authenticated users */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/70 text-yellow-400 border border-gray-600/30' 
                      : 'bg-gray-100/50 hover:bg-gray-200/70 text-gray-600 border border-gray-300/30'
                  }`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <button onClick={handleMenuOpen}>
              {!isMenuOpen === true ? (
                <img
                  src="/icons/menu.svg"
                  width={40}
                  height={40}
                  alt="hamburger-icon"
                  className=""
                />
              ) : (
                <img
                  src="/icons/close.svg"
                  width={40}
                  height={40}
                  alt="close-icon"
                />
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Menu for mobile devices / small screens */}
        {isMenuOpen && (
          <>
            <div className={`absolute top-full left-4 right-4 mt-2 ${
              isDarkMode 
                ? 'bg-gray-900/90 backdrop-blur-md border border-gray-700/40' 
                : 'bg-white/90 backdrop-blur-md border border-white/30'
            } rounded-xl shadow-xl md:hidden`}>
              <Menu
                className="flex flex-col pt-6 gap-y-0 animate-fade"
                linkClassNames={`${
                  isDarkMode 
                    ? 'hover:bg-blue-600/20 py-4 px-6 hover:text-blue-300 text-gray-200 rounded-lg mx-2' 
                    : 'hover:bg-blue-600/20 py-4 px-6 hover:text-blue-800 rounded-lg mx-2'
                }`}
                links={NavbarData?.menuItems}
                onLinkClick={() => setIsMenuOpen(false)}
              />
              <div className="flex gap-2 pb-6 pl-6 pr-6 pt-4 *:w-full animate-fade">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3 w-full">
                    <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-center mb-2`}>
                      Welcome, {user?.username}
                    </span>
                    {user?.userType === 'seller' && (
                      <a 
                        href="/seller/dashboard" 
                        className="w-full"
                        onClick={handleMenuOpen}
                      >
                        <Button 
                          bgColor="transparent linear-gradient(105deg, #3b82f6 0%, #1d4ed8 100%) 0% 0% no-repeat padding-box"
                          hoverColor="transparent linear-gradient(105deg, #1d4ed8 0%, #3b82f6 100%) 0% 0% no-repeat padding-box"
                        >
                          My Shop
                        </Button>
                      </a>
                    )}
                    
                    {/* Profile Button for Mobile */}
                    <button
                      onClick={handleMobileProfileClick}
                      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        isDarkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 border border-gray-600/30' 
                          : 'bg-gray-100/50 hover:bg-gray-200/70 text-gray-700 border border-gray-300/30'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Profile
                    </button>

                    {/* Dark Mode Toggle for Mobile - Authenticated */}
                    <button
                      onClick={toggleDarkMode}
                      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        isDarkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-700/70 text-yellow-400 border border-gray-600/30' 
                          : 'bg-gray-100/50 hover:bg-gray-200/70 text-gray-600 border border-gray-300/30'
                      }`}
                    >
                      {isDarkMode ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                          </svg>
                          Light Mode
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                          Dark Mode
                        </>
                      )}
                    </button>
                    
                    <Button 
                      onClick={() => {
                        handleLogout();
                        handleMenuOpen();
                      }}
                      bgColor="transparent linear-gradient(105deg, #ef4444 0%, #dc2626 100%) 0% 0% no-repeat padding-box"
                      hoverColor="transparent linear-gradient(105deg, #dc2626 0%, #ef4444 100%) 0% 0% no-repeat padding-box"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    {/* Dark Mode Toggle for Mobile - Non-authenticated */}
                    <button
                      onClick={toggleDarkMode}
                      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        isDarkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-700/70 text-yellow-400 border border-gray-600/30' 
                          : 'bg-gray-100/50 hover:bg-gray-200/70 text-gray-600 border border-gray-300/30'
                      }`}
                    >
                      {isDarkMode ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                          </svg>
                          Light Mode
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                          Dark Mode
                        </>
                      )}
                    </button>
                    
                    <a
                      onClick={handleMenuOpen}
                      href={"/register"}
                      className="w-full"
                    >
                      <Button
                        bgColor="transparent linear-gradient(105deg, #e9ad0d 0%, #e15603 100%) 0% 0% no-repeat padding-box"
                        hoverColor="transparent linear-gradient(105deg, #e15603 0%, #e9ad0d 100%) 0% 0% no-repeat padding-box"
                      >
                        Register
                      </Button>
                    </a>
                    <a
                      onClick={handleMenuOpen}
                      href={"/login"}
                      className="w-full"
                    >
                      <Button>Login</Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
      {isMenuOpen && (
        <div
          onClick={handleMenuOpen}
          className={`fixed w-screen h-screen backdrop-blur-sm top-0 left-0 -z-10 md:hidden ${
            isDarkMode ? 'bg-black/60' : 'bg-black/40'
          }`}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
