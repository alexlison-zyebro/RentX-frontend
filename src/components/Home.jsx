import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, MapPin, User, LogOut, Menu, X, 
  ChevronRight, RefreshCw, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Categories from './Categories.jsx';
import Products from './Products';
import MyRentals from './MyRentals';
import About from './About';

const Home = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const [userName] = useState(localStorage.getItem('userName') || 'User');
  const [userEmail] = useState(localStorage.getItem('email') || 'user@example.com');
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  
  const [userRoles] = useState(() => {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) return [];
    try {
      const roles = JSON.parse(rolesStr);
      return Array.isArray(roles) ? roles : [roles];
    } catch (e) {
      console.log("error->", e);
      return [];
    }
  });

  const canSwitchRoles = userRoles.includes('BUYER') && userRoles.includes('SELLER');
  const BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    if (!token) {
      alert('Please login to access this page.');
      navigate('/login');
      return;
    }

    // Check if user has BUYER role (allow both BUYER and SELLER roles)
    if (!userRoles.includes('BUYER')) {
      alert('Unauthorized access. This page is for buyers only.');
      localStorage.clear();
      navigate('/login');
      return;
    }
  }, [token, userRoles, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdown && !event.target.closest('.profile-dropdown')) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdown]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'categories':
        return <Categories token={token} />;
      case 'products':
        return <Products token={token} />;
      case 'myrentals':
        return <MyRentals token={token} />;
      case 'about':
        return <About />;
      default:
        return renderHomeContent();
    }
  };

  const renderHomeContent = () => {
    return (
      <section className="pt-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
            <Search className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">Welcome back, {userName}!</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Find the <span className="text-orange-600">Perfect Tool</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Access professional-grade power tools without the commitment. Rent from verified local sellers and complete your projects efficiently.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for power tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setLocation(e.target.value);
                  }
                }}
                
                className="w-full md:w-48 pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                {location.length}
              </div>
            </div>
            <button className="px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-black text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Tools Available</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-black text-gray-900">4.8★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-black text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Verified Sellers</div>
          </div>
        </div>
      </section>
    );
  };

  if (userRoles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-orange-600 text-xl font-bold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900">Rent<span className="text-orange-600">X</span></span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <button 
                onClick={() => setActiveSection('home')}
                className={`text-base font-medium transition-colors ${activeSection === 'home' ? 'text-orange-600 font-bold' : 'text-gray-700 hover:text-orange-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveSection('categories')}
                className={`text-base font-medium transition-colors ${activeSection === 'categories' ? 'text-orange-600 font-bold' : 'text-gray-700 hover:text-orange-600'}`}
              >
                Categories
              </button>
              <button 
                onClick={() => setActiveSection('products')}
                className={`text-base font-medium transition-colors ${activeSection === 'products' ? 'text-orange-600 font-bold' : 'text-gray-700 hover:text-orange-600'}`}
              >
                Products
              </button>
              <button 
                onClick={() => setActiveSection('myrentals')}
                className={`text-base font-medium transition-colors ${activeSection === 'myrentals' ? 'text-orange-600 font-bold' : 'text-gray-700 hover:text-orange-600'}`}
              >
                My Rentals
              </button>
              <button 
                onClick={() => setActiveSection('about')}
                className={`text-base font-medium transition-colors ${activeSection === 'about' ? 'text-orange-600 font-bold' : 'text-gray-700 hover:text-orange-600'}`}
              >
                About Us
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {canSwitchRoles && (
                <button
                  onClick={() => navigate('/sellerHome')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all border border-gray-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Switch to Seller
                </button>
              )}
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900">{userName}</div>
                    <div className="text-xs font-semibold text-orange-600 capitalize">buyer</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${profileDropdown ? 'rotate-90' : ''}`} />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{userName}</div>
                          <div className="text-sm text-gray-600">{userEmail}</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <a
                        href="/profile/edit"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <Edit className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Edit Profile</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenu && (
            <div className="lg:hidden py-4 space-y-1 border-t bg-white">
              <button 
                onClick={() => { setMobileMenu(false); setActiveSection('home'); }}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => { setMobileMenu(false); setActiveSection('categories'); }}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Categories
              </button>
              <button 
                onClick={() => { setMobileMenu(false); setActiveSection('products'); }}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                Products
              </button>
              <button 
                onClick={() => { setMobileMenu(false); setActiveSection('myrentals'); }}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                My Rentals
              </button>
              <button 
                onClick={() => { setMobileMenu(false); setActiveSection('about'); }}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                About Us
              </button>
              {canSwitchRoles && (
                <button onClick={() => { 
                  navigate('/sellerHome'); 
                  setMobileMenu(false); 
                }} className="w-full px-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Switch to Seller
                </button>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="px-4 py-3 bg-orange-50 rounded-lg mb-2">
                  <div className="font-bold text-gray-900">{userName}</div>
                  <div className="text-sm text-gray-600">{userEmail}</div>
                  <div className="text-sm text-orange-600 font-semibold capitalize mt-1">buyer</div>
                </div>
                <a href="/profile/edit" onClick={() => setMobileMenu(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </a>
                <button onClick={handleLogout} className="w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with Padding for Fixed Nav */}
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
  {/* Main Footer Content */}
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      
      {/* Brand Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black">
            Rent<span className="text-orange-500">X</span>
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your trusted marketplace for renting premium power tools and equipment. Quality tools, affordable rates.
        </p>
        <div className="flex gap-3">
          <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
        <ul className="space-y-2.5">
          <li>
            <button onClick={() => setActiveSection('home')} className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              Home
            </button>
          </li>
          <li>
            <button onClick={() => setActiveSection('categories')} className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              Categories
            </button>
          </li>
          <li>
            <button onClick={() => setActiveSection('products')} className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              Browse Tools
            </button>
          </li>
          <li>
            <button onClick={() => setActiveSection('myrentals')} className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              My Rentals
            </button>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h3>
        <ul className="space-y-2.5">
          <li>
            <button onClick={() => setActiveSection('about')} className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              About Us
            </button>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              Help Center
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              Contact Us
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center gap-2 group">
              <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
              Safety Guidelines
            </a>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Get In Touch</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-400">123 Tool Street, Equipment City, EC 12345</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:support@rentx.com" className="text-gray-400 hover:text-orange-500 transition-colors">support@rentx.com</a>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+1234567890" className="text-gray-400 hover:text-orange-500 transition-colors">+1 (234) 567-890</a>
          </li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-gray-800 my-8"></div>

    {/* Bottom Section */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-gray-400 text-sm">
        © 2026 <span className="text-white font-semibold">RentX</span>. All rights reserved.
      </p>
      
      <div className="flex items-center gap-6 text-sm">
        <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</a>
        <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Terms of Service</a>
        <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;