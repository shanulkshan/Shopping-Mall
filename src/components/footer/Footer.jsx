import React from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import NavbarData from "../../data/NavbarData";
import logo2 from "../../assets/logo2.png";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const { isDarkMode } = useDarkMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
      // Add toast notification here if needed
    }
  };

  const quickLinks = [
    { name: "Shops", href: "/shops" },
    { name: "Promotions", href: "/promotions" },
    { name: "QR Scanner", href: "/qr-scan" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "FAQ", href: "/faq" },
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Seller Guide", href: "/seller-guide" },
  ];

  const mallInfo = {
    name: NavbarData.title,
    address: "123 Commerce Street, Downtown Plaza",
    phone: "+94 (77) 123-4567",
    email: "info@serendibplaza.lk",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM"
  };

  return (
    <footer className={`relative ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Mall Info & Newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <img
                  src={logo2}
                  alt="Serendib Plaza"
                  className="w-12 h-12 rounded-2xl mr-4 object-contain"
                />
                <div>
                  <h3 className={`text-3xl font-poppins font-bold tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mallInfo.name}
                  </h3>
                  <p className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Serendib Plaza - Your Premier Shopping Destination
                  </p>
                </div>
              </div>
              
              <div className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {mallInfo.address}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {mallInfo.phone}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {mallInfo.email}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {mallInfo.hours}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-md rounded-2xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg`}>            <h4 className={`text-lg font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Stay Updated
            </h4>
            <p className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Subscribe to our newsletter for the latest promotions and mall updates
            </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`font-poppins ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200 flex items-center group`}
                  >
                    <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className={`text-lg font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 mt-8`}>
              Company
            </h4>
            <ul className="space-y-3">
              {company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`font-poppins ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200 flex items-center group`}
                  >
                    <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-lg font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Support
            </h4>
            <ul className="space-y-3">
              {support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`font-poppins ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-200 flex items-center group`}
                  >
                    <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 mt-8`}>
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-gray-700/50 hover:bg-blue-500/20' : 'bg-gray-100 hover:bg-blue-50'} flex items-center justify-center transition-all duration-300 transform hover:scale-110 group`}
              >
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-gray-700/50 hover:bg-pink-500/20' : 'bg-gray-100 hover:bg-pink-50'} flex items-center justify-center transition-all duration-300 transform hover:scale-110 group`}
              >
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-pink-400' : 'text-gray-600 group-hover:text-pink-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.185-1.559L12.017 8.68l6.753 6.749c-.737.948-1.888 1.559-3.185 1.559H8.449z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-gray-700/50 hover:bg-blue-500/20' : 'bg-gray-100 hover:bg-blue-50'} flex items-center justify-center transition-all duration-300 transform hover:scale-110 group`}
              >
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <div className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 md:mb-0`}>
            © 2024 {NavbarData.title}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="/privacy"
              className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
